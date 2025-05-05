from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'audiobooks',   views.AudiobookViewSet,   basename='audiobook')
router.register(r'bookchapters', views.BookChapterViewSet, basename='bookchapter')
router.register(r'authors',      views.AuthorViewSet,      basename='author')
router.register(r'narrators',    views.NarratorViewSet,    basename='narrator')
router.register(r'publishers',   views.PublisherViewSet,   basename='publisher')
router.register(r'tags',         views.TagViewSet,         basename='tag')
router.register(r'playlists',    views.PlaylistViewSet,    basename='playlist')
router.register(r'favorites',    views.FavoriteViewSet,    basename='favorite')
router.register(r'users',        views.UserViewSet,        basename='user')

urlpatterns = [
    # JWT:
    path('token/',         TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),    name='token_refresh'),

    # Registration & Login
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/',    views.LoginView.as_view(),    name='login'),

    # Single search endpoint:
    path('search/<str:query>/', views.EntitySearchView.as_view(), name='full-search'),

    # All the CRUD routes mounted by the router:
    path('', include(router.urls)),
]
