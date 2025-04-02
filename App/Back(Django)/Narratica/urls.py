from django.urls import path
from . import views

urlpatterns = [
    path('',views.getMenu, name='main-menu'),
    
    path('api/turtle/',views.getTest),
    
    path('api/audio',views.getAudio),
    path('api/audio/<int:book_id>/',views.getAudio),
    path('api/audio/<int:book_id>/<int:chapter_Number>',views.getAudio),
    path('api/audio/chapters/<int:book_id>',views.getAllChapters),
    path('api/audio/new',views.getNew),
    path('api/audio/new/<int:quantity>',views.getNew), 
    path('api/audio/tag/<int:tag_id>',views.getTag),
    path('api/audio/tag/<int:tag_id>/<int:quantity>',views.getTag),
    path('api/audio/author/<int:author_id>',views.getAuthor),
    path('api/audio/author/<int:author_id>/<int:quantity>',views.getAuthor),
    path('api/audio/publisher/<int:publisher_id>',views.getPublisher),
    path('api/audio/publisher/<int:publisher_id>/<int:quantity>',views.getPublisher),
    #TODO get by narrator (full + quantity)
    path('api/audio/upload/',views.postAudioBook), #TODO update to'api/upload/....'
    #TODO delete and patch book + chapter
    
    path('api/playlist/<int:playlist_id>',views.getPlaylist),
    path('api/playlist/create',views.postPlaylist, name='create_audioBook'),
    path('api/playlist/user/<int:user_id>',views.getUserPlaylist),
    #TODO update and delete playlist
    
    #TESTME ????? How does it work ??????
    path('api/favorite/addAudiobook',views.postFavoritesAudioBook),
    path('api/favorite/addAuthor',views.postFavoritesAuthor),
    path('api/favorite/addNarrator',views.postFavoritesNarrator),
    path('api/favorite/addPublisher',views.postFavoritesPublisher),
    
    #TODO CRUD User
    path('api/favorite/audioBook/<int:user_id>',views.getUserFavoriteAudioBook),
    path('api/favorite/author/<int:user_id>',views.getUserFavoriteAuthor),
    path('api/favorite/narrator/<int:user_id>',views.getUserFavoriteNarrator),
    path('api/favorite/publisher/<int:user_id>',views.getUserFavoritePublisher),
    
    path('api/author/<int:author_id>',views.getAuthorByID),
    path('api/narrator/<int:narrator_id>', views.getNarratorByID),
    path('api/publisher/<int:publisher_id>', views.getPublisherByID),
    
    ]