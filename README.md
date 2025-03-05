# MountainProject-AudioBook

## 1. Project Description

This project is an audio book streaming platform where users can listen to audio books and manage favorites. The application will have different user roles with specific permissions and a modern frontend built with React. The backend will be powered by Django and Django Rest Framework (DRF) to manage users, audio files, and authentication.


## 2. Technologies Used

### Frontend:

React (for UI)

React Router (for navigation)

Tailwind CSS (for styling)

Axios (for API requests)

React Query (for data fetching)

### Backend:

Django (Python framework)

Django Rest Framework (DRF) (for API)

PostgreSQL (or SQLite for development)

JWT Authentication (for user login and permissions)

Free Cloud Storage Solution (TBD - alternatives to AWS S3 or Firebase Storage)


## 3. Frontend Structure

### Main Features:

Audio Player: Always visible across all pages.

Homepage: Shows latest uploads, news from favorite authors, and categorized tags.

User Dashboard: Manage favorites and settings (including dark mode toggle).

Author/Publisher Pages: Managed by users to upload and organize audio (books as playlists, chapter as audio file).

Admin Dashboard: Manage users, content, and system-wide settings.

### Homepage Details:

Displays latest uploads.

Highlights news from favorite authors.

Includes tag-based categories to organize content.


## 4. Backend Structure

### Key Functionalities:

User Authentication (Register/Login with JWT, role-based access)

Audio File Management (Upload, store, and stream audio files)

Playlist & Favorites Management (Users can create and manage them)

Admin Controls (Manage users and content)

### User Roles & Permissions:

| Role            | Permissions                                                    |
|-----------------|----------------------------------------------------------------|
| Guest           | Listen to extracts of audio files, view homepage               |
| Subscribed User | Listen to full audio, add favorites (author, books,...)        |
| Author          | Upload audio files, create public playlists (books)            |
| Admin           | Manage users, handle CRUD operations for the entire app        |


## 5. Database Schema

Main Tables:

User (Django built-in with custom roles)

UserProfile (Extends User with roles & permissions)

AuthorPage (Managed by users for uploading content)

AudioFile (Stores uploaded audio files with tags)

Playlist/Books (Managed by AuthorPage to organize content)

Tag (Associated with audio files for categorization, one mandatory, maximum 3 per playlist/book)

Favorite (Links users to favorite books or author)


## 6. API Endpoints

### Authentication & User Management

POST /api/register/ → Register a new user

POST /api/login/ → Authenticate user (JWT token)

POST /api/admin/approve-author/ → Approve author pages (Admin only)

### Audio File Management

GET /api/audio/ → Get all public audio files

GET /api/audio/{id}/ → Get full audio (if user) or extract (if guest)

POST /api/audio/upload/ → Upload audio file (Author only)

### Playlist & Favorites Management

POST /api/playlists/create/ → Create a playlist

GET /api/playlists/{id}/ → Get playlist details

POST /api/favorites/ → Add an audio file to favorites


## 7. Steps

### First Steps & Priorities

✅ Setup GitHub repository & project structure

✅ Initialize Django backend (install dependencies, create models, configure database)

✅ Set up authentication & user roles

✅ Define API endpoints & permissions

✅ Set up React frontend (install dependencies, create basic page structure)

✅ Implement user authentication flow (login/register pages)

✅ Build User Dashboard (favorites, settings including dark mode toggle)

✅ Implement Author Pages (upload & manage audio files, organize in playlists/books)

✅ Create Admin Dashboard (manage users & content)

✅ Set up free cloud storage solution for audio files

✅ Develop API integration between frontend and backend

✅ Test & refine core features

### Bonus Features (If Time Allows)

✅ Optimize for mobile & add progressive web app (PWA) features

✅ Use tag-based recommendations for users based on listening history

✅ Enable rating system for audio files

✅ Implement editor/publisher company pages

✅ Deploy application with a free hosting solution
