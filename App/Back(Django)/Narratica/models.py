from django.db import models
from django.conf import settings

# Create your models here.

from django.contrib.auth.models import AbstractUser

# USER MODEL (Extending Django's Built-in User)
class User(AbstractUser):
    profile_img = models.TextField(blank=True, null=True)  # Cloud storage link
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        swappable = 'AUTH_USER_MODEL'  # Ensures Django recognizes this as the main User model

# AUTHOR, NARRATOR & PUBLISHER MODELS
class Author(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Narrator(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

# TAG MODEL
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# AUDIOBOOK MODEL
class AudioBook(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, related_name="books")
    narrator = models.ForeignKey(Narrator, on_delete=models.SET_NULL, null=True, related_name="narrations")
    publisher = models.ForeignKey(Publisher, on_delete=models.SET_NULL, null=True, related_name="publications")
    cover_art_jpg = models.TextField(blank=True, null=True)  # Cloud storage link
    cover_art_thumbnail = models.TextField(blank=True, null=True)  # Cloud storage link
    language = models.CharField(max_length=50)
    tags = models.ManyToManyField(Tag, blank=True)
    total_time = models.DurationField()
    total_number_of_listening = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

# BOOK CHAPTER MODEL
class BookChapter(models.Model):
    book = models.ForeignKey(AudioBook, on_delete=models.CASCADE, related_name="chapters")
    number_of_listening = models.PositiveIntegerField(default=0)
    total_time = models.DurationField()
    upload_date = models.DateField(auto_now_add=True)
    audio_data = models.TextField()  # Cloud storage link

    def __str__(self):
        return f"{self.book.title} - Chapter {self.id}"

# PLAYLIST MODEL
class Playlist(models.Model):
    name = models.CharField(max_length=255)
    book = models.ForeignKey(AudioBook, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Playlist: {self.name}"

# FAVORITE RELATIONSHIP MODELS
class FavoriteAuthor(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'author')

class FavoriteNarrator(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    narrator = models.ForeignKey(Narrator, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'narrator')

class FavoriteBook(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(AudioBook, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'book')

class FavoritePublisher(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'publisher')
