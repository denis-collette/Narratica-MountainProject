from  rest_framework.response import Response 
from rest_framework.decorators import api_view
from Narratica.models import *
from backend.serializers import *


errorMsg ="An error have occured"

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
            response = BookChapter.objects.all().order_by('-upload_date')
            serializer = BookChapterSerializer(response, many=True)
            response = serializer.data



            return Response(response)
    except:
            return Response(errorMsg)


@api_view(['GET'])
def getTag(request, *args, **kwargs):
    
    try:
        if(kwargs['tag_id'] != None and kwargs['quantity'] != None):
            quantity = kwargs['quantity']
            response = AudioBook.objects.filter( tags = kwargs['tag_id'])[:quantity]
            serializer = AudioBookSerializer(response, many=True)
            response = serializer.data
            return Response(response)
    except:
        pass

    try:
        if(kwargs['tag_id'] != None):
            response = AudioBook.objects.filter( tags = kwargs['tag_id'])
            serializer = AudioBookSerializer(response, many=True)
            response = serializer.data
            return Response(response)
    except:
        response = {"no tag id entered"}
        return Response(response)

@api_view(['GET'])
def getAuthor(request, *args, **kwargs):
    try:
        if(kwargs['book_id'] != None and kwargs['chapter_Number'] != None):
            response = BookChapter.objects.filter( book_id = kwargs['book_id'], chapter_number = kwargs['chapter_Number']  )
            serializer = BookChapterSerializer(response, many=True)
            response = serializer.data
            return Response(response)
    except:
            pass


@api_view(['GET'])
def getPublisher(request, *args, **kwargs):
    try:
        if(kwargs['book_id'] != None and kwargs['chapter_Number'] != None):
            response = BookChapter.objects.filter( book_id = kwargs['book_id'], chapter_number = kwargs['chapter_Number']  )
            serializer = BookChapterSerializer(response, many=True)
            response = serializer.data
            return Response(response)
    except:
            pass




@api_view(['POST'])
def postAudioBook(request):
    serializer = AudioBookSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)






