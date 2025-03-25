from  rest_framework.response import Response 
from rest_framework.decorators import api_view
from Narratica.models import AudioBook
from backend.serializers import AudioBookSerializer


@api_view(['GET'])
# return json 
def getAudio(request, *args, **kwargs):

    try:
        if(kwargs['book_id'] != None ):
            response = {'audio_book_id' : kwargs['book_id']}
    except:
        response = AudioBook.objects.all()
        serializer = AudioBookSerializer(response, many=True)
        response = serializer.data
    

    try:
        if(kwargs['book_id'] != None and kwargs['chapter_Number'] != None):
            response = { 'audio_book_id' : kwargs['book_id'],
                    'chapter_Number' : kwargs['chapter_Number']
                    }
    except:
        pass
    return Response(response)


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
