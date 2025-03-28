from django.urls import path
from . import views

urlpatterns = [
    path('',views.getMenu, name='main-menu'),
    path('api/audio',views.getAudio  ),
    path('api/audio/<int:book_id>/',views.getAudio ),
    path('api/audio/<int:book_id>/<int:chapter_Number>',views.getAudio ),
    path('api/turtle/',views.getTest),
    path('api/audio/new',views.getNew),
    path('api/audio/new/<int:quantity>',views.getNew), 
    path('api/audio/tag/<int:tag_id>',views.getTag),
    path('api/audio/tag/<int:tag_id>/<int:quantity>',views.getTag),
    path('api/audio/author/<int:author_id>',views.getAuthor),
    path('api/audio/author/<int:author_id>/<int:quantity>',views.getAuthor),
    path('api/audio/publisher/<int:publisher_id>',views.getPublisher),
    path('api/audio/publisher/<int:publisher_id>/<int:quantity>',views.getPublisher),
    path('api/audio/upload/',views.postAudioBook),
    path('api/playlists/<int:playlist_id>',views.getPlaylist),
    path('api/playlists/create',views.postPlaylist, name='create_audioBook'),
    path('api/favorites/addAudiobook',views.postFavoritesAudioBook),
    path('api/favorites/addAuthor',views.postFavoritesAuthor),
    path('api/favorites/addNarrator',views.postFavoritesNarrator),
    path('api/favorites/addPublisher',views.postFavoritesPublisher),
    path('api/playlists/user/<int:user_id>',views.getUserPlaylist),
    path('api/favorites/audioBook/<int:user_id>',views.getUserFavoriteAudioBook),
    path('api/favorites/author/<int:user_id>',views.getUserFavoriteAuthor),
    path('api/favorites/narrator/<int:user_id>',views.getUserFavoriteNarrator),
    path('api/favorites/publisher/<int:user_id>',views.getUserFavoritePublisher),

    ]