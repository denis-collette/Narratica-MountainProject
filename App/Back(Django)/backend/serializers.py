# convet db awne"r to understundable object for api

from django.contrib.auth import get_user_model
from rest_framework import serializers
from Narratica.models import *


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

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = '__all__'
        

class FavoriteBookSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteBook
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = '__all__'

class NarratorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Narrator
        fields = '__all__'
        
class PublisherSerializer(serializers.ModelSerializer):

    class Meta:
        model = Publisher
        fields = '__all__'

class FavoriteAuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteAuthor
        fields = '__all__'

class FavoriteNarratorSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteNarrator
        fields = '__all__'

class FavoritePublisherSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoritePublisher
        fields = '__all__'


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password
        )
        return user