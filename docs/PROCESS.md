# Narratica Project Setup

### Prerequisites
- Python 3.x
- PostgreSQL

### Setup Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/narratica.git
    cd narratica

2. Create a virtual environment:
    ```bash
    python -m venv env
    source env/Scripts/activate  # On Windows

3. Install dependencies:
    ```bash
    pip install -r requirements.txt

4. Configure the database settings in settings.py

5. Run migrations:
    ```bash
    python manage.py migrate

6. Start the development server:
    ```bash
    python manage.py runserver



7. DATABASES
Ensure that you have the PostgreSQL database set up and accessible, and that the connection details (e.g., DATABASES in settings.py) are correctly configured. If you're' working locally, you might need to ensure that you set up the database with the same name and user, or you can use different credentials but update the settings.py accordingly.

**Environment Variables for Sensitive Data**
Avoid hardcoding sensitive data (like database credentials). Instead, use environment variables and a `.env` file. Your `.env` file might look like this:
```plaintext
DB_NAME=narratica-db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=narratica-db.c5ay4iuoirdg.eu-north-1.rds.amazonaws.com
DB_PORT=5432

Then, use a package like 'python-decouple' or 'django-environ' to load these variables in settings.py.

Don't Forget:
Add '.env' to '.gitignore' to prevent it from being pushed to GitHub.