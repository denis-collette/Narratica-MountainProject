#### 1. Clone the repository:

git clone <repository_url>
cd Narratica/App/Back (Django)

#### 2. Create and activate the virtual environment:

python -m venv venv

.\venv\Scripts\activate  # Windows

OR

source venv/bin/activate  # Mac/Linux

#### 3. Install dependencies:

pip install -r requirements.txt

#### 4. Set up the database (run migrations):

python manage.py migrate

#### 5. Create a superuser (optional, for admin access):

python manage.py createsuperuser

#### 6. Run the server:

python manage.py runserver


#### 7. DATABASES
Ensure that you have the PostgreSQL database set up and accessible, and that the connection details (e.g., DATABASES in settings.py) are correctly configured. If you're' working locally, you might need to ensure that you set up the database with the same name and user, or you can use different credentials but update the settings.py accordingly.