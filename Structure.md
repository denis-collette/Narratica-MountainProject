# Project Folder Structure - MountainProject-AudioBook

This document outlines how the project folders and files should be organized for better maintainability, scalability, and collaboration among developers.

---

## **1. Root Folder Structure**
```
MountainProject-AudioBook/
│-- backend/                  # Django Backend
│-- frontend/                 # React Frontend
│-- docs/                     # Documentation (README, API specs, etc.)
│-- .gitignore                # Git ignore file
│-- docker-compose.yml        # Docker configuration (if used)
│-- README.md                 # Project Overview
│-- requirements.txt          # Backend dependencies
│-- package.json              # Frontend dependencies
│-- .env                      # Environment variables
```

---

## **2. Backend (Django) Structure**
```
backend/
│-- manage.py                  # Django management script
│-- config/                     # Main project settings
│   │-- __init__.py
│   │-- settings.py             # Global settings
│   │-- urls.py                 # Main URL router
│   │-- wsgi.py                 # WSGI entry point
│   │-- asgi.py                 # ASGI entry point (for WebSockets if needed)
│-- apps/
│   │-- authentication/         # Handles user authentication
│   │-- audiobooks/             # Manages audiobook-related logic
│   │-- playlists/              # Handles playlists & favorites
│   │-- admin_panel/            # Admin features
│-- api/
│   │-- serializers.py          # API serializers
│   │-- views.py                # API endpoints logic
│   │-- urls.py                 # API routes
│-- static/                     # Static files (CSS, images, etc.)
│-- media/                      # Uploaded media files (audiobooks, covers)
│-- tests/                      # Backend tests
│-- db.sqlite3                   # Local development database (can be PostgreSQL in production)
```

### **Backend Details**
- **config/** → Contains Django settings, URL configuration, and WSGI/ASGI setup.
- **apps/** → Separate Django apps for modular development:
  - `authentication/` → Handles users, JWT authentication, roles.
  - `audiobooks/` → Manages book uploads, metadata, streaming.
  - `playlists/` → User playlists, favorites.
  - `admin_panel/` → Admin CRUD operations.
- **api/** → Handles API logic (serializers, views, and routes).
- **static/** & **media/** → Stores frontend assets and uploaded media.
- **tests/** → Unit tests and API testing.

---

## **3. Frontend (React) Structure**
```
frontend/
│-- src/
│   │-- assets/                 # Images, icons, styles
│   │-- components/             # Reusable UI components
│   │-- pages/                  # Main application pages
│   │-- context/                # Global state management (React Context)
│   │-- services/               # API calls (Axios requests)
│   │-- utils/                  # Utility functions
│   │-- App.jsx                 # Root component
│   │-- main.jsx                # React entry point
│-- public/
│   │-- index.html              # Main HTML template
│-- .env                        # Environment variables
│-- package.json                # Frontend dependencies
│-- tailwind.config.js          # Tailwind CSS configuration
│-- vite.config.js              # Vite configuration (if using Vite)
```

### **Frontend Details**
- **assets/** → Icons, images, global styles.
- **components/** → Reusable UI elements (buttons, cards, modals, etc.).
- **pages/** → Main views (Homepage, Dashboard, Player, Admin Panel).
- **context/** → Global state management.
- **services/** → API handlers for backend communication.
- **utils/** → Helper functions.
- **App.jsx** → The main app component.
- **public/** → Contains the root HTML file.

---

## **4. Key Considerations**
### **Backend API Standards**
- **RESTful API with Django Rest Framework (DRF)**
- **JWT Authentication for user login/logout**
- **Pagination & caching for API performance**
- **Rate limiting for external API calls**

### **Frontend UX Considerations**
- **Dark Mode Toggle**
- **Always-visible Audio Player**
- **Responsive Design for Mobile & Desktop**
- **Optimized Search & Filtering System**

### **Deployment Strategy**
- **Backend:** Hosted on **Railway, Render, or Heroku**
- **Frontend:** Hosted on **Vercel or Netlify**
- **Database:** PostgreSQL on **CockroachDB or Supabase**
- **Media Storage:** Free cloud storage solution (TBD)