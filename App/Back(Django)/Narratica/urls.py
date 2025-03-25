from django.urls import path
from . import views

urlpatterns = [
    path('',views.getMenu, name='main-menu'),
    path('audio/',views.getAudio ),
    path('audio/<int:book_id>/',views.getAudio ),
    path('audio/<int:book_id>/<int:chapter_Number>',views.getAudio ),
    path('turtle/',views.getTest),
    path('audio/upload/',views.postAudioBook),
    ]