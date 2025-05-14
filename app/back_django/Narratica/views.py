from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend

from Narratica.models import *
from backend.serializers import *

from backend.utils.aws_s3 import upload_image_to_s3, upload_audio_to_s3, delete_file_from_s3

User = get_user_model()


### AUDIOBOOKS ###
class AudiobookViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Audiobook.objects.all()
    serializer_class = AudiobookSerializer

    @action(detail=True, methods=['get'])
    def chapters(self, request, pk=None):
        qs = BookChapter.objects.filter(book_id=pk)
        return Response(BookChapterSerializer(qs, many=True).data)
    
    @action(detail=True, url_path='chapters/(?P<chapter_number>[^/.]+)', methods=['get'])
    def chapter(self, request, pk=None, chapter_number=None):
        try:
            chapter = BookChapter.objects.get(book_id=pk, chapter_number=chapter_number)
        except BookChapter.DoesNotExist:
            return Response(
                {"detail": "Chapter not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = BookChapterSerializer(chapter)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def newest(self, request):
        qty = int(request.GET.get('quantity', 10))
        chapters = BookChapter.objects.order_by('-upload_date')
        seen, books = set(), []
        for ch in chapters:
            if ch.book_id not in seen:
                seen.add(ch.book_id)
                books.append(ch.book)
                if len(books) >= qty:
                    break
        return Response(AudiobookSerializer(books, many=True).data)

    @action(detail=False, methods=['get'], url_path='by-author/(?P<author_id>[^/.]+)')
    def by_author(self, request, author_id=None):
        qs = self.queryset.filter(author_id=author_id).order_by('total_number_of_listening')
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'], url_path='by-narrator/(?P<narrator_id>[^/.]+)')
    def by_narrator(self, request, narrator_id=None):
        qs = self.queryset.filter(narrator_id=narrator_id).order_by('total_number_of_listening')
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'], url_path='by-publisher/(?P<publisher_id>[^/.]+)')
    def by_publisher(self, request, publisher_id=None):
        qs = self.queryset.filter(publisher_id=publisher_id).order_by('total_number_of_listening')
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, url_path='by-tag/(?P<tag_id>[^/.]+)')
    def by_tag(self, request, tag_id=None):
        books = self.queryset.filter(tags__id=tag_id)

        quantity = request.query_params.get('quantity')
        if quantity is not None and quantity.isdigit():
            books = books[:int(quantity)]

        page = self.paginate_queryset(books)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Handle cover_art_jpg upload
        if 'cover_art_jpg' in request.FILES:
            image_file = request.FILES['cover_art_jpg']
            image_url = upload_image_to_s3(image_file)
            data['cover_art_jpg'] = image_url
            
        # Auto-create Author if needed
        author_name = data.get('author_name')
        if author_name:
            author, _ = Author.objects.get_or_create(name=author_name.strip())
            data['author'] = author.id

        # Auto-create Narrator if needed
        narrator_name = data.get('narrator_name')
        if narrator_name:
            narrator, _ = Narrator.objects.get_or_create(name=narrator_name.strip())
            data['narrator'] = narrator.id

        # Auto-create Tags if needed
        tag_names = request.data.getlist('tag_names[]')  # From frontend
        tag_ids = []
        for tag_name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=tag_name.strip())
            tag_ids.append(tag.id)
        data.setlist('tags', tag_ids)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        # Replace image if new one provided
        if 'cover_art_jpg' in request.FILES:
            if instance.cover_art_jpg:
                delete_file_from_s3(instance.cover_art_jpg)
            image_file = request.FILES['cover_art_jpg']
            image_url = upload_image_to_s3(image_file)
            data['cover_art_jpg'] = image_url

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Delete cover image
        if instance.cover_art_jpg:
            try:
                delete_file_from_s3(instance.cover_art_jpg)
            except Exception as e:
                logger.warning(f"Failed to delete cover image from S3: {e}")

        # Delete all chapter audio files related to this book
        for chapter in instance.chapters.all():
            if chapter.audio_file:
                try:
                    delete_file_from_s3(chapter.audio_file)
                except Exception as e:
                    logger.warning(f"Failed to delete chapter audio file from S3: {e}")
        
        # Delete unused tags
        for tag in instance.tags.all():
            if tag.audiobook_set.count() == 1:  # Only linked to this one
                tag.delete()

        return super().destroy(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        user = self.request.user

        # 1. Get or create the publisher based on username
        publisher, _ = Publisher.objects.get_or_create(name=user.username)

        # 2. Save the audiobook with the publisher
        serializer.save(publisher=publisher)


### BOOK CHAPTERS ###
class BookChapterViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = BookChapter.objects.all()
    serializer_class = BookChapterSerializer
    
    @action(detail=True, methods=['post'], url_path='increment-listening')
    def increment_listening(self, request, pk=None):
        try:
            chapter = self.get_object()
            chapter.number_of_listening += 1
            chapter.save()
            
            audiobook = chapter.book
            total_listening = audiobook.chapters.aggregate(
                total=Sum('number_of_listening')
            )['total'] or 0
            audiobook.total_number_of_listening = total_listening
            audiobook.save()
            
            return Response({
                "message": "Listening count updated.",
                "chapter_id": chapter.id,
                "chapter_count": chapter.number_of_listening,
                "audiobook_id": audiobook.id,
                "audiobook_total": total_listening,
            }, status=status.HTTP_200_OK)
            
        except BookChapter.DoesNotExist:
            return Response({"error": "Chapter not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        if 'audio_file' in request.FILES:
            audio = request.FILES['audio_file']
            audio_url = upload_audio_to_s3(audio)
            data['audio_data'] = audio_url

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        if 'audio_file' in request.FILES:
            if instance.audio_data:
                delete_file_from_s3(instance.audio_data)
            audio = request.FILES['audio_file']
            audio_url = upload_file_to_s3(audio)
            data['audio_data'] = audio_url

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.audio_data:
            try:
                delete_file_from_s3(instance.audio_data)
            except Exception as e:
                logger.warning(f"Failed to delete audio file from S3: {e}")

        return super().destroy(request, *args, **kwargs)


### AUTHORS, NARRATORS, PUBLISHERS ###
class AuthorViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    
    def list(self, request, *args, **kwargs):
        quantity = request.query_params.get('quantity')
        queryset = self.get_queryset()

        if quantity is not None and quantity.isdigit():
            queryset = queryset[:int(quantity)]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class NarratorViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Narrator.objects.all()
    serializer_class = NarratorSerializer
    
    def list(self, request, *args, **kwargs):
        quantity = request.query_params.get('quantity')
        queryset = self.get_queryset()

        if quantity is not None and quantity.isdigit():
            queryset = queryset[:int(quantity)]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class PublisherViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    
    def list(self, request, *args, **kwargs):
        quantity = request.query_params.get('quantity')
        queryset = self.get_queryset()

        if quantity is not None and quantity.isdigit():
            queryset = queryset[:int(quantity)]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


### TAGS ###
class TagViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Tag.objects.all()
    serializer_class = TagsSerializer


### PLAYLISTS ###
class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

    @action(detail=False, methods=['get'], url_path='by-user/(?P<user_id>[^/.]+)')
    def by_user(self, request, user_id=None):
        qs = self.queryset.filter(user_id=user_id)
        return Response(self.get_serializer(qs, many=True).data)


### FAVORITES ###
class FavoriteBookViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteBookSerializer
    queryset = FavoriteBook.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'book']

class FavoriteAuthorViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteAuthorSerializer
    queryset = FavoriteAuthor.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'author']
    
class FavoriteNarratorViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteNarratorSerializer
    queryset = FavoriteNarrator.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'narrator']

class FavoritePublisherViewSet(viewsets.ModelViewSet):
    serializer_class = FavoritePublisherSerializer
    queryset = FavoritePublisher.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'publisher']


### SEARCH ENTITIES ###
class EntitySearchView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, query):
        data = {}
        data['audiobooks'] = AudiobookSerializer(Audiobook.objects.filter(title__icontains=query), many=True).data
        data['authors']    = AuthorSerializer(Author.objects.filter(name__icontains=query), many=True).data
        data['narrators']  = NarratorSerializer(Narrator.objects.filter(name__icontains=query), many=True).data
        data['publishers'] = PublisherSerializer(Publisher.objects.filter(name__icontains=query), many=True).data
        return Response(data)


### USERS & AUTH ###
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = LoginSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        user = s.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token),
            'user_id': user.id, 'username': user.username})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return super().get_permissions()
    
    def get_queryset(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return self.queryset.filter(id=self.request.user.id)
        return self.queryset
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        profile_img_url = user.profile_img

        # Delete the image from S3 if present
        if profile_img_url:
            delete_file_from_s3(profile_img_url)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)