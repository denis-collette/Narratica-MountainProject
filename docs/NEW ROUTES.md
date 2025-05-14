# Narratica API Endpoints

Check below [full version](#gpt-lapi).

## Updates

### Authentication

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| `POST /api/register/` | `POST /api/register/` | Register a new user |
| `POST /api/login/` | `POST /api/login/` | Authenticate user (JWT token) |
| `GET /api/token/` | `POST /api/token/` | Obtain JWT token |
| `GET /api/token/refresh/` | `POST /api/token/refresh/` | Refresh JWT token |

### Users

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| `GET /api/users/` | `GET /api/users/` | List all users |
| `GET /api/user/<int:pk>/` | `GET /api/users/{pk}/` | Retrieve specific user |

### Audiobooks & Chapters

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| `GET /api/audio/` | `GET /api/audiobooks/` | List all audiobooks |
| `GET /api/audio/<int:book_id>` | `GET /api/audiobooks/{id}/` | Retrieve a single audiobook |
| `POST /api/audio/upload/` OR `POST /api/upload/audiobook` | `POST /api/audiobooks/` | Create a new audiobook |
| / | `PUT/PATCH/DELETE /api/audiobooks/{id}/` | Update or delete a specific audiobook |
| `GET /api/audio/chapters/<int:book_id>/` | `GET /api/audiobooks/{id}/chapters/` | List chapters of an audiobook |
| `api/audio/<int:book_id>/<int:chapter_Number>` | `GET /api/audiobooks/{id}/chapters/{chapterId}` | Retrieve a single chapter of an audiobook |
| `GET /api/audio/new` | `GET /api/audiobooks/newest` | List all newest audiobooks |
| `GET /api/audio/new?quantity=N` | `GET /api/audiobooks/newest/?quantity=N` | List newest audiobooks (with quantity) |
| `GET /api/audio/by-author/{author_id}/` | `GET /api/audiobooks/by-author/{author_id}/` | Search audiobooks by author |
| `GET /api/audio/by-narrator/{narrator_id}/` | `GET /api/audiobooks/by-narrator/{narrator_id}/` | Search audiobooks by narrator |
| `GET /api/audio/by-publisher/{publisher_id}/` | `GET /api/audiobooks/by-publisher/{publisher_id}/` | Search audiobooks by publisher |
| `GET api/audio/tag/<int:tag_id>` | `GET /api/audiobooks/by-tag/{tag_id}/` | Search all audiobooks by tag |
| `GET api/audio/tag/<int:tag_id>/<int:quantity>` | `GET /api/audiobooks/by-tag/{tag_id}/?quantity=N` | Search audiobooks by tag (with quantity) |

### Authors, Narrators, Publishers

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| / | `GET /api/authors/` | List all authors |
| `GET api/audio/author/<int:author_id>/<int:quantity>` **???** | `GET /api/authors/?quantity=N` | List all authors (with quantity) |
| `GET /api/author/<int:author_id>` | `GET /api/authors/{pk}/` | Retrieve a single author by ID |
| / | `GET /api/narrators/` | List all narrators |
| `GET api/audio/narrator/<int:narrator_id>/<int:quantity>` **???** | `GET /api/narrators/?quantity=N` | List all narrators (with quantity) |
| `GET /api/narrator/<int:narrator_id>` | `GET /api/narrators/{pk}/` | Retrieve a single narrator by ID |
| / | `GET /api/publishers/` | List all publishers |
| `GET api/audio/publisher/<int:publisher_id>/<int:quantity>` **???** | `GET /api/publishers/?quantity=N` | List all publishers (with quantity) |
| `GET /api/publisher/<int:publisher_id>` | `GET /api/publishers/{pk}/` | Retrieve a single publisher by ID |

### Tags

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| `GET /api/tags/` | `GET /api/tags/` | List all tags |
| `GET /api/tag/<int:tag_id>` | `GET /api/tags/{pk}/` | Retrieve a single tag by ID |

### Playlists

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| `GET /api/playlist/<int:playlist_id>` | `GET /api/playlists/{id}/` | Retrieve specific playlist |
| `GET /api/playlist/user/<int:user_id>` | `GET /api/playlists/by-user/{user_id}/` | List playlists for a user |
| `POST /api/playlist/create` | `POST /api/playlists/` | Create a new playlist |
| / | `PUT/PATCH/DELETE /api/playlists/{id}/` | Update or delete a playlist |

### Favorites

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| `GET /api/favorite/audiobook/<int:user_id>` | `GET /api/favorites/?type=book&user={user_id}` | List favorite audiobooks from user |
| `GET /api/favorite/author/<int:user_id>` | `GET /api/favorites/?type=author&user={user_id}` | List favorite authors from specific user |
| `GET /api/favorite/narrator/<int:user_id>` | `GET /api/favorites/?type=narrator&user={user_id}` | List favorite narrators from specific user |
| `GET /api/favorite/publisher/<int:user_id>` | `GET /api/favorites/?type=publisher&user={user_id}` | List favorite publishers from specific user |
| `POST /api/favorite/addAudiobook` | `POST /api/favorites/?type=book&user={user_id}` | Add favorite audiobook to specific user |
| `POST /api/favorite/addAuthor` | `POST /api/favorites/?type=author&user={user_id}` | Add favorite author to specific user |
| `POST /api/favorite/addNarrator` | `POST /api/favorites/?type=narrator&user={user_id}` | Add favorite narrator to specific user |
| `POST /api/favorite/addPublisher` | `POST /api/favorites/?type=publisher&user={user_id}` | Add favorite publisher to specific user |

### Search

| Old Path | New Endpoint | Description |
|-----|-----|-----|
| `GET /api/search/audio/<str:audiobook_name>` | `GET /api/search/{query}/?model=audiobook` | Search audiobooks by name |
| `GET /api/search/author/<str:author_name>` | `GET /api/search/{query}/?model=author` | Search authors by name |
| `GET /api/search/narrator/<str:narrator_name>` | `GET /api/search/{query}/?model=narrator` | Search narrators by name |
| `GET /api/search/publisher/<str:publisher_name>` | `GET /api/search/{query}/?model=publisher` | Search publishers by name |
| `GET /api/search/<str:search_query>` | `GET /api/search/{query}/` | Global search across audiobooks, authors, narrators, publishers |

---

## GPT L'API

### 🔐 Authentication

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/register/ | Register a new user |
| POST | /api/login/ | Login and get JWT tokens |
| POST | /api/token/ | Obtain access/refresh token |
| POST | /api/token/refresh/ | Refresh JWT access token |

### 👤 Users

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/users/ | List all users |
| GET | /api/users/{id}/ | Retrieve a user |
| PUT or PATCH or DELETE | /api/users/<user_id>/ | Edit/delete a user |

### 🎧 Audiobooks

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/audiobooks/ | List all audiobooks |
| POST | /api/audiobooks/ | Create a new audiobook |
| GET | /api/audiobooks/{id}/ | Retrieve a specific audiobook |
| PUT | /api/audiobooks/{id}/ | Update an audiobook |
| PATCH | /api/audiobooks/{id}/ | Partially update an audiobook |
| DELETE | /api/audiobooks/{id}/ | Delete an audiobook |
| GET | /api/audiobooks/{id}/chapters/ | Get all chapters of the audiobook |
| GET | /api/audiobooks/{id}/chapters/{n}/ | Get specific chapter by chapter number |
| GET | /api/audiobooks/newest/ | Get most recently uploaded books |
| GET | /api/audiobooks/by-author/{author_id}/ | List audiobooks by a specific author |
| GET | /api/audiobooks/by-narrator/{narrator_id}/ | List audiobooks by a specific narrator |
| GET | /api/audiobooks/by-publisher/{publisher_id}/ | List audiobooks by a specific publisher |
| GET | /api/audiobooks/by-tag/{tag_id}/ | List audiobooks by tag (optional ?quantity=) |

### 📚 Book Chapters

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/bookchapters/ | List all book chapters |
| POST | /api/bookchapters/ | Create a chapter |
| GET | /api/bookchapters/{id}/ | Retrieve a chapter |
| PUT | /api/bookchapters/{id}/ | Update a chapter |
| PATCH | /api/bookchapters/{id}/ | Partially update a chapter |
| DELETE | /api/bookchapters/{id}/ | Delete a chapter |
| POST | /api/bookchapters/{chapter_id}/increment-listening/ | Increment number of listening of a chapter |

### ✍️ Authors

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/authors/ | List all authors (optional ?quantity=) |
| POST | /api/authors/ | Create an author |
| GET | /api/authors/{id}/ | Retrieve an author |
| PUT | /api/authors/{id}/ | Update an author |
| PATCH | /api/authors/{id}/ | Partially update an author |
| DELETE | /api/authors/{id}/ | Delete an author |

### 🗣️ Narrators

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/narrators/ | List all narrators (optional ?quantity=) |
| POST | /api/narrators/ | Create a narrator |
| GET | /api/narrators/{id}/ | Retrieve a narrator |
| PUT | /api/narrators/{id}/ | Update a narrator |
| PATCH | /api/narrators/{id}/ | Partially update a narrator |
| DELETE | /api/narrators/{id}/ | Delete a narrator |

### 🏢 Publishers

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/publishers/ | List all publishers (optional ?quantity=) |
| POST | /api/publishers/ | Create a publisher |
| GET | /api/publishers/{id}/ | Retrieve a publisher |
| PUT | /api/publishers/{id}/ | Update a publisher |
| PATCH | /api/publishers/{id}/ | Partially update a publisher |
| DELETE | /api/publishers/{id}/ | Delete a publisher |

### 🏷️ Tags

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/tags/ | List all tags |
| POST | /api/tags/ | Create a tag |
| GET | /api/tags/{id}/ | Retrieve a tag |
| PUT | /api/tags/{id}/ | Update a tag |
| PATCH | /api/tags/{id}/ | Partially update a tag |
| DELETE | /api/tags/{id}/ | Delete a tag |

### 🎵 Playlists

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/playlists/ | List all playlists |
| POST | /api/playlists/ | Create a playlist |
| GET | /api/playlists/{id}/ | Retrieve a playlist |
| PUT | /api/playlists/{id}/ | Update a playlist |
| PATCH | /api/playlists/{id}/ | Partially update a playlist |
| DELETE | /api/playlists/{id}/ | Delete a playlist |
| GET | /api/playlists/by-user/{user_id}/ | Get playlists created by user |

### ⭐ Favorites

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/favorites/books/?user={id} | Get user’s favorites book |
| GET | /api/favorites/books/?user={id}&book={id} | Get user’s favorite specific book |
| GET | /api/favorites/author/?user={id} | Get user’s favorites author |
| GET | /api/favorites/author/?user={id}&author={id} | Get user’s favorite specific author |
| GET | /api/favorites/narrator/?user={id} | Get user’s favorites narrator |
| GET | /api/favorites/narrator/?user={id}&narrator={id} | Get user’s favorite specific narrator |
| GET | /api/favorites/publisher/?user={id} | Get user’s favorites publisher |
| GET | /api/favorites/publisher/?user={id}&publisher={id} | Get user’s favorite specific publisher |
| POST | /api/favorites/books/?user={id} | Add a favorite book to user |
| POST | /api/favorites/author/?user={id} | Add a favorite author to user |
| POST | /api/favorites/narrator/?user={id} | Add a favorite narrator to user |
| POST | /api/favorites/publisher/?user={id} | Add a favorite publisher to user |
| POST | /api/favorites/ | Add a favorite (based on query params & body data) |
| DELETE | /api/favorites/books/{id}/ | Remove a favorite book |
| DELETE | /api/favorites/author/{id}/ | Remove a favorite author |
| DELETE | /api/favorites/narrator/{id}/ | Remove a favorite narrator |
| DELETE | /api/favorites/publisher/{id}/ | Remove a favorite publisher |

### 🔍 Search

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/search/{query}/ | Search authors, books, narrators… |


## 📘 Audiobook Upload

### **Endpoint**: `POST /api/audiobooks/upload/`

Used to upload a new audiobook, including its metadata and cover image.

### **Payload Format (multipart/form-data)**:

| Field             | Type            | Required | Description |
|------------------|-----------------|----------|-------------|
| `title`          | string          | ✅       | Title of the audiobook |
| `description`    | string          | ✅       | Description or synopsis |
| `cover_art_jpg`  | file (image)    | ✅       | JPEG image for the cover art |
| `language`       | string          | ✅       | Language code (e.g., "en", "fr") |
| `authors`        | string (JSON)   | ✅       | JSON array of author names (auto-create if not existing) |
| `narrators`      | string (JSON)   | ✅       | JSON array of narrator names (auto-create if not existing) |
| `tags`           | string (JSON)   | ✅       | JSON array of tags (auto-create if not existing) |

**Example** (`multipart/form-data`):
```
title: "La Guerre des Étoiles"
description: "Une saga épique..."
cover_art_jpg: [upload file]
language: "fr"
authors: ["Jean Dupont"]
narrators: ["Claire Dubois"]
tags: ["science-fiction", "aventure"]
```

---

## 📕 Chapter Upload

### **Endpoint**: `POST /api/book-chapters/upload/`

Uploads a single chapter and associates it with an existing audiobook.

### **Payload Format (multipart/form-data)**:

| Field           | Type            | Required | Description |
|----------------|-----------------|----------|-------------|
| `audiobook_id` | integer         | ✅       | ID of the audiobook |
| `title`        | string          | ✅       | Chapter title |
| `audio_data`   | file (audio)    | ✅       | Audio file (MP3 or WAV) |
| `duration`     | float (seconds) | ✅       | Duration in seconds |
| `chapter_index`| integer         | ✅       | Order of the chapter |

**Example**:
```
audiobook_id: 42
title: "Chapitre 1 : L'Éveil"
audio_data: [upload audio file]
duration: 300.5
chapter_index: 1
```

---

## 🗑 Audiobook Deletion

### **Endpoint**: `DELETE /api/audiobooks/{id}/delete/`

Deletes the audiobook and all associated chapters + S3 files.

---

## 🔁 Audiobook Update

### **Endpoint**: `PUT /api/audiobooks/{id}/update/`

Update the metadata of an audiobook. Supports re-upload of `cover_art_jpg`.

---

## 🛠 Notes

- All uploads should be made authenticated with the user's access token.
- Auto-creation of authors, narrators, and tags is handled server-side.
- S3 paths are automatically assigned and managed (including cleanup).

---