# convet db awne"r to understundable object for api


from rest_framework import serializers
from Narratica.models import AudioBook, BookChapter,Playlist,FavoriteAuthor,FavoriteNarrator,FavoriteBook,FavoritePublisher,Tag


class AudioBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioBook
        fields = '__all__'


class BookChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookChapter
        fields = '__all__'

class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'