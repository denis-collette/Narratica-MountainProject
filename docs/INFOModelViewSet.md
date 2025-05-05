# Django REST Framework: `ModelViewSet` Documentation

## 🔧 What is a `ModelViewSet`?

A **`ModelViewSet`** is a class provided by Django REST Framework that bundles together **all the common CRUD operations** (list, retrieve, create, update, delete) into a **single class**. It uses a **router** to automatically generate all the related URLs.

This is the most compact and DRY (Don’t Repeat Yourself) way to build RESTful APIs in DRF, especially when you’re working with standard CRUD logic.

---

## ✅ What does `ModelViewSet` give you?

| Method            | HTTP Verb | URL Pattern (auto-generated)     | Description         |
|-------------------|-----------|----------------------------------|---------------------|
| `list()`          | GET       | `/api/audiobooks/`               | Get all audiobooks  |
| `retrieve()`      | GET       | `/api/audiobooks/{id}/`         | Get one audiobook   |
| `create()`        | POST      | `/api/audiobooks/`               | Create audiobook    |
| `update()`        | PUT       | `/api/audiobooks/{id}/`         | Full update         |
| `partial_update()`| PATCH     | `/api/audiobooks/{id}/`         | Partial update      |
| `destroy()`       | DELETE    | `/api/audiobooks/{id}/`         | Delete audiobook    |

---

## 🧱 How to Use `ModelViewSet`

### 1. Define the viewset:

```
from rest_framework.viewsets import ModelViewSet
from .models import Audiobook
from .serializers import AudiobookSerializer

class AudiobookViewSet(ModelViewSet):
    queryset = Audiobook.objects.all()
    serializer_class = AudiobookSerializer
```

### 2. Register it in `urls.py` using a **router**:

```
from rest_framework.routers import DefaultRouter
from .views import AudiobookViewSet

router = DefaultRouter()
router.register(r'audiobooks', AudiobookViewSet, basename='audiobook')

urlpatterns = [
    path('', include(router.urls)),
]
```

This auto-generates routes like:
- `GET /audiobooks/`
- `GET /audiobooks/1/`
- `POST /audiobooks/`
- `PUT /audiobooks/1/`
- `PATCH /audiobooks/1/`
- `DELETE /audiobooks/1/`

---

## 🧠 When Should You Use `ModelViewSet`?

- ✅ You want quick full CRUD functionality.
- ✅ You want to reduce boilerplate.
- ✅ You follow standard RESTful patterns.
- ✅ You're using a router (`DefaultRouter` or `SimpleRouter`).

---

## 🔍 When **Not** to Use `ModelViewSet`?

- ❌ You need very custom logic or endpoints.
- ❌ You don’t want to use routers.
- ❌ You're not following RESTful conventions.

---