from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

# USER MODEL (Extending Django's Built-in User)
class User(AbstractUser):
    profile_img = models.TextField(blank=True, null=True)  # Cloud storage link
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        swappable = 'AUTH_USER_MODEL'  # Ensures Django recognizes this as the main User model
        verbose_name_plural = "Users"

# AUTHOR, NARRATOR & PUBLISHER MODELS
class Author(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Authors"

class Narrator(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Narrators"

class Publisher(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Publishers"

# TAG MODEL
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Tags"

# AUDIOBOOK MODEL
class Audiobook(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE ,related_name="books")
    narrator = models.ForeignKey(Narrator, on_delete=models.CASCADE,  related_name="narrations")
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE,  related_name="publications")
    cover_art_jpg = models.TextField(blank=True)  # Cloud storage link
    language = models.CharField(max_length=50)
    tags = models.ManyToManyField(Tag, blank=True)
    total_time = models.DurationField(blank=True, null=True)
    total_number_of_listening = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Audiobooks"

# BOOK CHAPTER MODEL
class BookChapter(models.Model):
    book = models.ForeignKey(Audiobook, on_delete=models.CASCADE, related_name="chapters")
    chapter_number = models.PositiveIntegerField(default=1)  # Stores the chapter order
    number_of_listening = models.PositiveIntegerField(default=0)
    total_time = models.DurationField()
    upload_date = models.DateTimeField(default=timezone.now)
    audio_data = models.TextField()  # Cloud storage link

    def __str__(self):
        return f"{self.book.title} - Chapter {self.chapter_number}"
    
    class Meta:
        verbose_name_plural = "Book chapters"
        ordering = ['chapter_number']

# PLAYLIST MODEL
class Playlist(models.Model):
    name = models.CharField(max_length=255)
    book = models.ForeignKey(Audiobook, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username}'s Playlist: {self.name}"
    
    class Meta:
        verbose_name_plural = "Playlists"

# FAVORITE MODELS
# ABSTRACT BASE CLASS
class FavoriteBase(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    class Meta:
        abstract = True

# RELATIONSHIPS 
class FavoriteBook(FavoriteBase):
    book = models.ForeignKey(Audiobook, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'book')
        verbose_name_plural = "Favorite books"

class FavoriteAuthor(FavoriteBase):
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'author')
        verbose_name_plural = "Favorite authors"

class FavoriteNarrator(FavoriteBase):
    narrator = models.ForeignKey(Narrator, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'narrator')
        verbose_name_plural = "Favorite narrators"

class FavoritePublisher(FavoriteBase):
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'publisher')
        verbose_name_plural = "Favorite publishers"

#? IDEAS FOR LATER:
#? ADD A FAVORITE FOR TAGS?
#? ADD A FAVORITE FOR USERS (FRIEND)?