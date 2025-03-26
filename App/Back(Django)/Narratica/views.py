from  rest_framework.response import Response 
from rest_framework.decorators import api_view
from Narratica.models import AudioBook
from Narratica.models import BookChapter
from backend.serializers import AudioBookSerializer
from backend.serializers import BookChapterSerializer

@api_view(['GET'])
# return json 
def getAudio(request, *args, **kwargs):

    try:
        if(kwargs['book_id'] != None and kwargs['chapter_Number'] != None):
            response = BookChapter.objects.filter( book_id = kwargs['book_id'], chapter_number = kwargs['chapter_Number']  )
            serializer = BookChapterSerializer(response, many=True)
            response = serializer.data
            return Response(response)
    except:
        pass

    try:
        if(kwargs['book_id'] != None ):
            response = AudioBook.objects.filter(id = kwargs['book_id']) #limit to the 10  first
            serializer = AudioBookSerializer(response, many=True)
            response = serializer.data
            return Response(response)
            #response = {'audio_book_id' : kwargs['book_id']}
            
    except:
        response = AudioBook.objects.all() # add [10] to limit the number of book answered (will crash if fewer book in db)
        serializer = AudioBookSerializer(response, many=True)
        response = serializer.data
        return Response(response)

    return Response("An error have occured")
    


@api_view(['GET'])
# return json 
def getMenu(request):
    chapter = {'this is the main menu'}
    return Response(chapter)



@api_view(['GET'])
def getTest(request):
    chapter = {'mine turtle' : 'hellooooo'}
    return Response(chapter)


@api_view(['POST'])
def postAudioBook(request):
    serializer = AudioBookSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)
