from rest_framework.response import Response 
from rest_framework import status
from rest_framework.decorators import api_view
from Narratica.models import *
from backend.serializers import *
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

#TESTME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# from django.http import JsonResponse

# def audiobooks_list(request):
#     return JsonResponse({"message": "List of audiobooks"})
#TESTME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


errorMsg ="An error have occurred"

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
            response = AudioBook.objects.filter(id = kwargs['book_id']) 
            serializer = AudioBookSerializer(response, many=True)
            response = serializer.data
            return Response(response)
            #response = {'audio_book_id' : kwargs['book_id']}
    except:
        response = AudioBook.objects.all()[:50]
        serializer = AudioBookSerializer(response, many=True)
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
            bookInfo = AudioBook.objects.filter(id = bookId)
            serializer = AudioBookSerializer(bookInfo, many=True)
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
            response = AudioBook.objects.filter( author = kwargs['tag_id']).order_by('total_number_of_listening')
            serializer = AudioBookSerializer(response, many=True)
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
            response = AudioBook.objects.filter( author = kwargs['author_id']).order_by('total_number_of_listening')
            serializer = AudioBookSerializer(response, many=True)
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
            response = AudioBook.objects.filter( publisher = kwargs['publisher_id']).order_by('total_number_of_listening')
            serializer = AudioBookSerializer(response, many=True)
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
            response = AudioBook.objects.filter(narrator = kwargs['narrator_id']).order_by('total_number_of_listening')
            serializer = AudioBookSerializer(response, many=True)
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
def postAudioBook(request):

    # check received data

    # The id begin to 1 for the first Post 
    serializer = AudioBookSerializer(data=request.data)
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
def getUserFavoriteAudioBook(request, *args, **kwargs):
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
def postFavoritesAudioBook(request):
    # check recived data
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


# path('api/tag/<int:tag_id>', views.getTagByID),

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