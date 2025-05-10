from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from Narratica.models import *
from .utils.aws_s3 import upload_image_to_s3

class AudiobookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audiobook
        fields = '__all__'
        read_only_fields = ['id']

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
    profile_img = serializers.ImageField(required=False)

    class Meta:
        model = get_user_model()
        fields = ['username', 'profile_img', 'first_name', 'last_name', 'email', 'password']

    def validate_profile_img(self, value):
        if not value:
            return value
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Image size should not exceed 2MB.")
        if not value.content_type.startswith("image/"):
            raise serializers.ValidationError("Invalid image type.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        profile_img=validated_data.get('profile_img', None)
        
        if profile_img:
            s3_url = upload_image_to_s3(profile_img) if profile_img else None
            validated_data['profile_img'] = s3_url
        
        user = get_user_model().objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            profile_img=validated_data.get('profile_img', None),
            password=password
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            raise AuthenticationFailed('Invalid credentials')

        attrs['user'] = user
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'profile_img', 'email', 'first_name', 'last_name', 'last_login', 'is_active', 'created_at', 'date_joined', 'is_staff', 'is_superuser']
