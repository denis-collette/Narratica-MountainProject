## 6. API Endpoints

### **Authentication & User Management**
- `POST /api/register/` → Register a new user
- `POST /api/login/` → Authenticate user (JWT token)
- `POST /api/admin/approve-author/` → Approve author pages (Admin only)
- `POST /api/admin/review-reports/` → Handle user-reported content (Admin only)

### **Audiobook File Management**

- #### `GET /api/audio/`
**Description**: Retrieve all publicly available audiobooks.  /

- #### `GET /api/audio/{book_id}/`
**Description**: Get detailed information about a specific audiobook, including author, narrator, release date, cover art, and other metadata.

- #### `GET /api/audio/{book_id}/{chapter_number}`
**Description**: Get detailed information about a specific chapter of an audiobook, including the chapter's audio file or extract (if the user is a guest).

- #### `GET /api/audio/chapters/{book_id}/`
**Description**: Get all chapters of a specific audiobook.

- #### `GET /api/audio/new/{(optional)quantity}`
**Description**: Retrieve the latest X uploaded audiobooks.  
**Note**: The quantity parameter is optional.

- #### `GET /api/audio/tag/{tag_id}/{(optional)quantity}`
**Description**: Retrieve the most-viewed audiobooks associated with a specific tag.  
**Note**: The quantity parameter is optional.

- #### `GET /api/audio/author/{author_id}/{(optional)quantity}`
**Description**: Retrieve the most-viewed audiobooks by a specific author.  
**Note**: The quantity parameter is optional.

- #### `GET /api/audio/publisher/{publisher_id}/{(optional)quantity}`
**Description**: Retrieve the most-viewed audiobooks from a specific publisher.  
**Note**: The quantity parameter is optional.


- ### `POST /api/author/{author_id}`
**Description**: Get author name.  


- ### `POST /api/author/{author_id}`
**Description**: Get author name.  

- #### `POST /api/audio/upload/`
**Description**: Upload an audiobook file.  
*Author-only access. Author verification is not enforced at the moment.*  


#### Request Body Parameters:

| Key                        | Type   | Description                                                                 | Required |
|----------------------------|--------|-----------------------------------------------------------------------------|----------|
| `title`                    | string | The title of the audiobook.                                                 | Yes      |
| `description`              | string | A brief description of the audiobook.                                       | No       |
| `author`                   | int    | The ID of the author of the audiobook.                                      | Yes      |
| `narrator`                 | int    | The ID of the narrator for the audiobook.                                   | Yes      |
| `publisher`                | int    | The ID of the publisher of the audiobook.                                   | Yes      |
| `cover_art_jpg`            | string | URL or file path to the cover art image in JPG format.                      | No       |
| `cover_art_thumbnail`      | string | URL or file path to the cover art thumbnail image.                          | No       |
| `language`                 | string | The language in which the audiobook is available.                           | Yes      |
| `tags`                     | int    | A list of tags associated with the audiobook.                               | No       |
| `total_time`               | string | Total duration of the audiobook in the format `hh:mm:ss`                    | No       |
| `total_number_of_listening`| int    | The total number of times the audiobook has been listened to (default = 0). | No       |

## **Playlist & Favorites Management**

- #### `GET /api/playlist/{id}/`
**Description**: Retrieve the details of a specific playlist.

- #### `GET /api/playlist/user/{user id}`
**Description**: Retrieve all playlist of a user.

- #### `GET /api/favorite/audioBook/{user_id}`
**Description**: Retrieve all favorite audiobooks of a specific user.  

#### Response Object:
```json
[
  {
    "id": 1,
    "user": 3,
    "book": 1
  }
]
```

- #### `GET /api/favorite/author/{user id}`
**Description**: Retrieve all favorite author of a user.

```json
[
  {
    "id": 1,
    "user": 3,
    "author": 1
  }
]
```

- #### `GET /api/favorite/narrator/{user id}`
**Description**: Retrieve all favorite narrator of a user.

```json
[
  {
    "id": 1,
    "user": 3,
    "narrator": 1
  }
]
```

- #### `GET /api/favorite/publisher/{user id}`
**Description**: Retrieve all favorite publisher of a user.

```json
[
  {
    "id": 1,
    "user": 3,
    "publisher": 1
  }
]
```

- #### `POST /api/playlist/create/`
**Description**: Create a new playlist.

#### Request Body Parameters:

| Key                        | Type   | Description                                                                 | Required |
|----------------------------|--------|-----------------------------------------------------------------------------|----------|
| `name`                     | string | The title of the audiobook.                                                 | Yes      |
| `book`                     | int    | The ID of the audiobook.                                                    | Yes      |
| `user`                     | int    | The ID of the user                                                          | Yes      |

- #### `POST /api/favorite/addAudiobook`
**Description**: Add an audiobook to the user's favorites list.

#### Request Body Parameters:

| Key                        | Type   | Description                                                                 | Required |
|----------------------------|--------|-----------------------------------------------------------------------------|----------|
| `user`                     | int    | The ID of the user                                                          | Yes      |
| `book`                     | int    | The ID of the audiobook.                                                    | Yes      |

- #### `POST /api/favorite/addAuthor`
**Description**: Add an Author to the user's favorites list.

#### Request Body Parameters:

| Key                        | Type   | Description                                                                 | Required |
|----------------------------|--------|-----------------------------------------------------------------------------|----------|
| `user`                     | int    | The ID of the user                                                          | Yes      |
| `author`                   | int    | The ID of the audiobook.                                                    | Yes      |

- #### `POST /api/favorite/addNarrator`
**Description**: Add a Narrator to the user's favorites list.

#### Request Body Parameters:

| Key                        | Type   | Description                                                                 | Required |
|----------------------------|--------|-----------------------------------------------------------------------------|----------|
| `user`                     | int    | The ID of the user                                                          | Yes      |
| `narrator`                 | int    | The ID of the audiobook.                                                    | Yes      |

- #### `POST /api/favorite/addPublisher`
**Description**: Add a Publisher to the user's favorites list.

#### Request Body Parameters:

| Key                        | Type   | Description                                                                 | Required |
|----------------------------|--------|-----------------------------------------------------------------------------|----------|
| `user`                     | int    | The ID of the user                                                          | Yes      |
| `publisher`               | int    | The ID of the audiobook.                                                    | Yes      |

## Author, narrator, publisher management.

- #### `GET api/narrator/<int:narrator_id>`
**Description**: Get a specific narrator's info

- #### `GET api/publisher/<int:publisher_id>`
**Description**: Get a specific publisher's info

- #### `GET api/tag/{tag_id}`
**Description**: Get tag name

- #### `GET api/tags`
**Description**: Get all tags

---