from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from Narratica.models import *
from backend.serializers import *
from rest_framework.parsers import MultiPartParser, FormParser
import boto3

errorMsg ="An error have occurred"
User = get_user_model

@api_view(['GET'])
# return json 
def getAudio(request, *args, **kwargs):

    try:
        if(kwargs['book_id'] != None and kwargs['chapter_Number'] != None):
            response = BookChapter.objects.filter( book = kwargs['book_id'], id = kwargs['chapter_Number']  )
            serializer = BookChapterSerializer(response, many=True)
            response = serializer.data
            return Response(response)
    except:
        pass

    try:
        if(kwargs['book_id'] != None ):
            response = Audiobook.objects.filter(id = kwargs['book_id']) 
            serializer = AudiobookSerializer(response, many=True)
            response = serializer.data
            return Response(response)
            #response = {'audio_book_id' : kwargs['book_id']}
    except:
        response = Audiobook.objects.all()[:50]
        serializer = AudiobookSerializer(response, many=True)
        response = serializer.data
        return Response(response)

    return Response(errorMsg)

@api_view(['GET'])
def getAllChapters(request, *args, **kwargs):
    
    try:
        if(kwargs['book_id'] != None):
            response = BookChapter.objects.filter( book = kwargs['book_id'])
            serializer = BookChapterSerializer(response, many=True)
            response = serializer.data
            try:
                if (kwargs['quantity'] != None):
                    quantity = kwargs['quantity']
                    response = response[:quantity] #trim the list
            except:
                pass
            return Response(response)
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
# return json 
def getMenu(request):
    chapter = {'this is the main menu'}
    return Response(chapter)

@api_view(['GET'])
def getTest(request):
    chapter = href='https://youtu.be/6bZq6NiTQ9o'
    return Response(chapter)

@api_view(['GET'])
def getNew(request, *args, **kwargs):
    try:
        # get all newest chapter (only chapter have time stamp)
        responseObj= []
        response = BookChapter.objects.all().order_by('-upload_date')
        serializer = BookChapterSerializer(response, many=True)
        response = serializer.data

        # sort book chapter to have a list of unique id
        listOfBookId = sortBook(response)

        # get all book by id
        for bookId in listOfBookId:
            bookInfo = Audiobook.objects.filter(id = bookId)
            serializer = AudiobookSerializer(bookInfo, many=True)
            responseObj.append(serializer.data)
        
        # get desired answer size
        try:
            if(kwargs['quantity'] != None):
                responseObj = responseObj[:kwargs['quantity']]
        except:
            pass

        return Response(responseObj)
    except:
        return Response(errorMsg)

@api_view(['GET'])
def getTag(request, *args, **kwargs):
    try:
        if(kwargs['tag_id'] != None):
            response = Audiobook.objects.filter( author = kwargs['tag_id']).order_by('total_number_of_listening')
            serializer = AudiobookSerializer(response, many=True)
            response = serializer.data

            try:
                if (kwargs['quantity'] != None):
                    quantity = kwargs['quantity']
                    response = response[:quantity] #trim the list
            except:
                pass
            return Response(response)
    
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getAuthor(request, *args, **kwargs):
    try:
        if(kwargs['author_id'] != None):
            response = Audiobook.objects.filter( author = kwargs['author_id']).order_by('total_number_of_listening')
            serializer = AudiobookSerializer(response, many=True)
            response = serializer.data

            try:
                if (kwargs['quantity'] != None):
                    quantity = kwargs['quantity']
                    response = response[:quantity] #trim the list
            except:
                pass
            return Response(response)
    
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getPublisher(request, *args, **kwargs):
    try:
        if(kwargs['publisher_id'] != None):
            response = Audiobook.objects.filter( publisher = kwargs['publisher_id']).order_by('total_number_of_listening')
            serializer = AudiobookSerializer(response, many=True)
            response = serializer.data

            try:
                if (kwargs['quantity'] != None):
                    quantity = kwargs['quantity']
                    response = response[:quantity] #trim the list
            except:
                pass
            return Response(response)
    
    except Exception as e:
        return Response(errorMsg, repr(e))

@api_view(['GET'])
def getNarrator(request, *args, **kwargs):
    try:
        if(kwargs['narrator_id'] != None):
            response = Audiobook.objects.filter(narrator = kwargs['narrator_id']).order_by('total_number_of_listening')
            serializer = AudiobookSerializer(response, many=True)
            response = serializer.data

            try:
                if (kwargs['quantity'] != None):
                    quantity = kwargs['quantity']
                    response = response[:quantity] #trim the list
            except:
                pass
            return Response(response)
    
    except Exception as e:
        return Response(errorMsg, repr(e))

@api_view(['POST'])
def postAudiobook(request):
    # check received data

    # The id begin to 1 for the first Post 
    serializer = AudiobookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data , status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getPlaylist(request, *args, **kwargs):
    try:
        if(kwargs['playlist_id'] != None):
            response = Playlist.objects.filter( id = kwargs['playlist_id'])
            serializer = PlaylistSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getUserPlaylist(request, *args, **kwargs):
    try:
        if(kwargs['user_id'] != None):
            response = Playlist.objects.filter( user = kwargs['user_id'])
            serializer = PlaylistSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getUserFavoriteAudiobook(request, *args, **kwargs):
    try:
        if(kwargs['user_id'] != None):
            response = FavoriteBook.objects.filter( user = kwargs['user_id'])
            serializer = FavoriteBookSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getUserFavoriteAuthor(request, *args, **kwargs):
    try:
        if(kwargs['user_id'] != None):
            response = FavoriteAuthor.objects.filter( user = kwargs['user_id'])
            serializer = FavoriteAuthorSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getUserFavoriteNarrator(request, *args, **kwargs):
    try:
        if(kwargs['user_id'] != None):
            response = FavoriteNarrator.objects.filter( user = kwargs['user_id'])
            serializer = FavoriteNarratorSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getUserFavoritePublisher(request, *args, **kwargs):
    try:
        if(kwargs['user_id'] != None):
            response = FavoritePublisher.objects.filter( user = kwargs['user_id'])
            serializer = FavoritePublisherSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['POST'])
def postPlaylist(request):
    # check recived data
    
    # The id beggin to 1 for the first Post 
    serializer = PlaylistSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data , status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def postFavoritesAudiobook(request):
    # check received data
    
    # The id beggin to 1 for the first Post 
    serializer = FavoriteBookSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data , status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def postFavoritesAuthor(request):
    serializer = FavoriteAuthorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data , status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def postFavoritesNarrator(request):
    serializer = FavoriteNarratorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data , status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def postFavoritesPublisher(request):
    serializer = FavoritePublisherSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data , status = status.HTTP_201_CREATED)
    return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getAuthorByID(request, *args, **kwargs):
    try:
        if(kwargs['author_id'] != None):
            response = Author.objects.filter( id = kwargs['author_id'])
            serializer = AuthorSerializer(response, many=True)
        if(kwargs['author_id'] != None):
            response = Author.objects.filter(id = kwargs['author_id'])
            serializer = AuthorSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

def sortBook(listObj):
    bookIdList = []

    for chapter in listObj:
        if chapter['book'] not in  bookIdList:
            bookIdList.append(chapter['book'])

    return bookIdList

@api_view(['GET'])
def getNarratorByID(request, *args, **kwargs):
    try:
        if(kwargs['narrator_id'] != None):
            response = Narrator.objects.filter(id = kwargs['narrator_id'])
            serializer = NarratorSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getPublisherByID(request, *args, **kwargs):
    try:
        if(kwargs['publisher_id'] != None):
            response = Publisher.objects.filter(id = kwargs['publisher_id'])
            serializer = PublisherSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getTagByID(request, *args, **kwargs):

    try:
        if(kwargs['tag_id'] != None):
            response = Tag.objects.filter(id = kwargs['tag_id'])
            serializer = TagsSerializer(response, many=True)
            response = serializer.data
            return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

@api_view(['GET'])
def getTags(request, *args, **kwargs):
    try:
        response = Tag.objects.all()
        serializer = TagsSerializer(response, many=True)
        response = serializer.data
        return Response(response)
        
    except Exception as e:
        return Response(errorMsg ,  repr(e))

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Generate JWT token for the user
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response({
                'refresh': str(refresh),
                'access': str(access_token),
                'user_id': user.id,
                'username': user.username,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookchapterUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')

        if not file_obj:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        try:
            s3.upload_fileobj(
                file_obj,
                settings.AWS_STORAGE_BUCKET_NAME,
                f'audiobooks/{file_obj.name}',
                ExtraArgs={'ContentType': file_obj.content_type}
            )

            file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/audiobooks/{file_obj.name}"

            return Response({'message': 'File uploaded successfully!', 'file_url': file_url}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserListView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

class UserDetailView(generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    
@api_view(['GET'])
def getAudiobookByName(request, audiobook_name):
    matching_audiobooks = Audiobook.objects.filter(title__icontains=audiobook_name)
    
    if matching_audiobooks.exists():
        serializer = AudiobookSerializer(matching_audiobooks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No matching audiobooks found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def getAuthorByName(request, author_name):
    matching_author = Author.objects.filter(name__icontains=author_name)
    
    if matching_author.exists():
        serializer = AuthorSerializer(matching_author, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No matching author found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def getNarratorByName(request, narrator_name):
    matching_narrator = Narrator.objects.filter(name__icontains=narrator_name)
    
    if matching_narrator.exists():
        serializer = NarratorSerializer(matching_narrator, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No matching narrator found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def getPublisherByName(request, publisher_name):
    matching_publisher = Publisher.objects.filter(name__icontains=publisher_name)
    
    if matching_publisher.exists():
        serializer = PublisherSerializer(matching_publisher, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'No matching publisher found.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def fullSearch(request, search_query):
    query = search_query

    if not query:
        return Response({'error': 'Please provide a search query with ?q=your_search_term'}, status=status.HTTP_400_BAD_REQUEST)

    # Search audiobooks by title
    audiobooks = Audiobook.objects.filter(title__icontains=query)
    audiobooks_serialized = AudiobookSerializer(audiobooks, many=True).data

    # Search authors by name
    authors = Author.objects.filter(name__icontains=query)
    authors_serialized = AuthorSerializer(authors, many=True).data

    # Search narrators by name
    narrators = Narrator.objects.filter(name__icontains=query)
    narrators_serialized = NarratorSerializer(narrators, many=True).data

    # Search publishers by name
    publishers = Publisher.objects.filter(name__icontains=query)
    publishers_serialized = PublisherSerializer(publishers, many=True).data

    return Response({
        'audiobooks': audiobooks_serialized,
        'authors': authors_serialized,
        'narrators': narrators_serialized,
        'publishers': publishers_serialized
    }, status=status.HTTP_200_OK)