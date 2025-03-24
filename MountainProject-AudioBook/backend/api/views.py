from  rest_framework.response import Response 
from rest_framework.decorators import api_view



@api_view(['GET'])
# return json 
def getAudio(request, *args, **kwargs):

 #sql search

    #if(kwargs['book_id'] != None && kwargs['chapter_Number'] != None):
        # Sql search for chapter in book 

     #if(kwargs['book_id'] != None ):
        # Sql search for book 

    response = { 'audio_book_id' : kwargs['book_id'],
                'chapter_Number' : kwargs['chapter_Number']
                }
    return Response(response)



@api_view(['GET'])
# return json 
def getMenu(request):
    chapter = {'this is the main menu'}
    return Response(chapter)



@api_view(['GET'])
def getTest(request):
    chapter = {'turtle' : 'hello'}
    return Response(chapter)




@api_view(['GET'])
def getBookTest(request, *args, **kwargs):



    chapter = { 'id' : kwargs['id']}
    return Response(chapter)