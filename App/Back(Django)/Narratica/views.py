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
            
            # get desired awnser size
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
        if(kwargs['tag_id'] != None and kwargs['quantity'] != None):
            quantity = kwargs['quantity']
            response = AudioBook.objects.filter( tags = kwargs['tag_id']).order_by('number_of_listening')[:quantity]
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
        return Response(errorMsg ,  repr(e))





@api_view(['POST'])
def postAudioBook(request):
    serializer = AudioBookSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)




def sortBook(listObj):

    bookIdList = []

    for chapter in listObj:
        if chapter['book'] not in  bookIdList:
            bookIdList.append(chapter['book'])

    return bookIdList