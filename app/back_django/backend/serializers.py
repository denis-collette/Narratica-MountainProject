from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from Narratica.models import *
from .utils.aws_s3 import upload_image_to_s3, delete_file_from_s3, upload_audio_to_s3

class AudiobookSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        required=False
    )

    class Meta:
        model = Audiobook
        fields = '__all__'
        read_only_fields = ['id']

    def validate_cover_art_jpg(self, value):
        if hasattr(value, 'read'):  # If it's a file-like object
            return upload_image_to_s3(value)
        return value  # Already a URL or string

    def update(self, instance, validated_data):
        new_image = validated_data.get('cover_art_jpg', None)
        old_image = instance.cover_art_jpg

        # Upload new image if it's a file
        if new_image and hasattr(new_image, 'read'):
            validated_data['cover_art_jpg'] = upload_image_to_s3(new_image)
            # Delete old image if it existed
            if old_image:
                delete_file_from_s3(old_image)

        return super().update(instance, validated_data)

    def delete(self):
        # This is normally handled in the ViewSet, but adding for context
        image_url = self.instance.cover_art_jpg
        if image_url:
            delete_file_from_s3(image_url)
        self.instance.delete()

class BookChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookChapter
        fields = '__all__'
        read_only_fields = ['id', 'number_of_listening', 'upload_date']
    
    def validate_audio_data(self, value):
        if hasattr(value, 'read'):
            return upload_audio_to_s3(value)
        return value  # Already a URL or string
        
    def create(self, validated_data):
        audio_file = self.context['request'].FILES.get('audio_file')
        if audio_file:
            validated_data['audio_file'] = upload_audio_to_s3(audio_file)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_audio = validated_data.get('audio_data', None)
        old_audio = instance.audio_data

        # Upload new audio if file-like
        if new_audio and hasattr(new_audio, 'read'):
            validated_data['audio_data'] = upload_image_to_s3(new_audio)
            if old_audio:
                delete_file_from_s3(old_audio)

        return super().update(instance, validated_data)

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
    profile_img = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = get_user_model()
        fields = [
            'id', 'username', 'profile_img', 'email',
            'first_name', 'last_name', 'last_login',
            'is_active', 'created_at', 'date_joined',
            'is_staff', 'is_superuser'
        ]
        read_only_fields = [
            'id', 'last_login', 'is_active',
            'created_at', 'date_joined',
            'is_staff', 'is_superuser'
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        profile_img = instance.profile_img
        rep['profile_img'] = str(profile_img) if profile_img else None
        return rep

    def update(self, instance, validated_data):
        profile_img = validated_data.pop('profile_img', None)

        if profile_img is not None:
            # Delete the old image from S3 if it exists and is a URL (not a local file or empty string)
            if instance.profile_img and isinstance(instance.profile_img, str):
                delete_file_from_s3(instance.profile_img)

            if profile_img == "":
                instance.profile_img = None
            else:
                s3_url = upload_image_to_s3(profile_img)
                instance.profile_img = s3_url

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance