# Narratica Project (AI README)

Welcome to the Narratica project! This guide provides all the steps needed to set up the Django backend, connect to the PostgreSQL database hosted on AWS RDS, and import initial data into the system.

---

## Prerequisites
Before starting, ensure you have the following:
- Python 3.x installed.
- PostgreSQL client tools (e.g., `psql`) installed.
- SSH access to the Narratica Bastion Host using the provided `.pem` key file.
- Access to the project repository on GitHub.
- Your network or IP configured to connect through the Bastion Host.

---

## Setup Instructions

### 1. Clone the Repository
1. Open a terminal and navigate to your workspace directory.
2. Clone the Git repository:
   ```
   git clone git@github.com:denis-collette/Narratica-MountainProject.git
   cd Narratica-MountainProject
   ```

---

### 2. Configure Django

1. Ensure you have received the `.env` file from the project administrator.
2. Place the `.env` file in App/Back(Django)/backend.

---

### 3. Set Up the Virtual Environment
1. Create a virtual environment inside the Back(Django) folder:
   ```
   cd App/Back(Django)
   python -m venv env
   ```
   On Linux it might be:
   ```
   python3 -m venv env
   ```

2. Activate the virtual environment:
   - On Windows (Git Bash):
      ```
      source env/Scripts/activate
      ```
   - On Windows (PowerShell):
      ```
      .\env\Scripts\Activate
      ```
   - On Linux/macOS:
      ```
      source env/bin/activate
      ```

3. Install the required dependencies, reset sequence (to upload in db) and run server (Django):
   ```
   pip install -r requirements.txt
   python manage.py fix_sequence
   python manage.py runserver
   ```
   For linux use the linuxRequirements.txt
   If your database isn't set up yet, just intall the dependencies and go to [Run Database Migrations](#4-run-database-migrations).

4. Install the required dependencies and run server (Next):
   Open a new bash terminal in root and launch:
   ```
   cd App/Front(React)/narratica
   npm install
   npm run dev
   ```

---

### 4. Run Database Migrations
1. Apply migrations to set up the database schema:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

---

### 5. Import Data from CSV
To import data into the `Publisher` table:
1. Create a new file, e.g., `import_publishers.py`, and add the following script:
   ```
   import csv
   from your_app.models import Publisher  # Replace 'your_app' with your Django app name

   with open('Narratica_publisher_202503261414.csv', newline='') as csvfile:
       reader = csv.DictReader(csvfile)
       for row in reader:
           Publisher.objects.create(
               id=row['id'],
               name=row['name']
           )
   print("Import complete!")
   ```

2. Run the script via Django’s shell:
   ```
   python manage.py shell
   Paste the script into the shell to execute it.
   ```

---

### 6. Verify the Setup
1. Use Django ORM to verify the imported data:
   ```
   from your_app.models import Publisher
   print(Publisher.objects.all())
   ```

2. Alternatively, check directly in PostgreSQL:
   ```
   psql -h 127.0.0.1 -p 5432 -U postgres -d narratica-db
   Run:
   SELECT * FROM "Publisher";
   ```

---

## Troubleshooting
1. Migrations Issues:
   - Ensure models are correctly defined in `models.py`.
   - Check if the app is included in `INSTALLED_APPS` in `settings.py`.

2. CSV Import Errors:
   - Confirm the file name and column headers match the expected structure.

---

## Need Help?
For any issues, reach out to the project administrator.

---