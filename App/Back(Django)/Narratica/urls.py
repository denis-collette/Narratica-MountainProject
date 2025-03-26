from django.urls import path
from . import views

urlpatterns = [
    path('',views.getMenu, name='main-menu'),
    path('audio/',views.getAudio ),
    path('audio/<int:book_id>/',views.getAudio ),
    path('audio/<int:book_id>/<int:chapter_Number>',views.getAudio ),
    path('turtle/',views.getTest),
    path('audio/new',views.getNew),
    path('audio/new/<int:quantity>',views.getNew),
    path('audio/tag/<int:tag_id>',views.getTag),
    path('audio/tag/<int:tag_id>/<int:quantity>',views.getTag),
    path('audio/author/<int:author_id>',views.getAuthor),
    path('audio/author/<int:author_id>/<int:quantity>',views.getAuthor),
    path('audio/publisher/<int:publisher_id>',views.getPublisher),
    path('audio/publisher/<int:publisher_id>/<int:quantity>',views.getPublisher),
    path('audio/upload/',views.postAudioBook),
    path('playlists/<int:playlist_id>',views.getPlaylist),
    path('playlists/create',views.postPlaylist),
    ]