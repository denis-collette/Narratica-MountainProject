from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(AudioBook)
admin.site.register(BookChapter)
admin.site.register(Author)
admin.site.register(Narrator)
admin.site.register(Publisher)
admin.site.register(Tag)
admin.site.register(Playlist)
admin.site.register(FavoriteBook)
admin.site.register(FavoriteAuthor)
admin.site.register(FavoriteNarrator)
admin.site.register(FavoritePublisher)