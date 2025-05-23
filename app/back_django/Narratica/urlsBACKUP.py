from django.urls import path
from . import views
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('',views.getMenu, name='main-menu'), #! NOT IN NEW URLS
    
    path('api/turtle/',views.getTest),  #! NOT IN NEW URLS
        
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
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
    
    #TESTME get by narrator (full + quantity)
    path('api/audio/narrator/<int:narrator_id>',views.getNarrator),
    path('api/audio/narrator/<int:narrator_id>/<int:quantity>',views.getNarrator),
    
    #? Useless
    path('api/audio/upload/',views.postAudiobook), 
    #? update to'api/upload/.... =>'
    #TESTME New route to upload audiobook
    path('api/upload/audiobook/', views.postAudiobook),
    
    #TESTME post chapter
    path('api/upload/bookchapter/', BookchapterUploadView.as_view(), name='upload-bookchapter'),
    
    #TODO patch and delete book + chapter
    
    path('api/playlist/<int:playlist_id>',views.getPlaylist),
    path('api/playlist/create',views.postPlaylist, name='create_audioBook'),
    path('api/playlist/user/<int:user_id>',views.getUserPlaylist),
    
    #TODO patch and delete playlist
    
    #TESTME ????? How does it work ??????
    path('api/favorite/addAudiobook',views.postFavoritesAudiobook),
    path('api/favorite/addAuthor',views.postFavoritesAuthor),
    path('api/favorite/addNarrator',views.postFavoritesNarrator),
    path('api/favorite/addPublisher',views.postFavoritesPublisher),
    
    #TODO CRUD User
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/users/', UserListView.as_view(), name='user-list'),
    path('api/user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    
    path('api/favorite/audiobook/<int:user_id>',views.getUserFavoriteAudiobook),
    path('api/favorite/author/<int:user_id>',views.getUserFavoriteAuthor),
    path('api/favorite/narrator/<int:user_id>',views.getUserFavoriteNarrator),
    path('api/favorite/publisher/<int:user_id>',views.getUserFavoritePublisher),
    
    path('api/author/<int:author_id>',views.getAuthorByID),
    path('api/narrator/<int:narrator_id>', views.getNarratorByID),
    path('api/publisher/<int:publisher_id>', views.getPublisherByID),
    path('api/tags', views.getTags),
    path('api/tag/<int:tag_id>', views.getTagByID),
    
    # SEARCH BY NAME
    path('api/search/audio/<str:audiobook_name>',views.getAudiobookByName),
    path('api/search/author/<str:author_name>',views.getAuthorByName),
    path('api/search/narrator/<str:narrator_name>',views.getNarratorByName),
    path('api/search/publisher/<str:publisher_name>',views.getPublisherByName),
    # SEARCH AUDIOBOOKS, AUTHOR, NARRATOR, PUBLISHER AT ONCE
    path('api/search/<str:search_query>',views.fullSearch),
    ]