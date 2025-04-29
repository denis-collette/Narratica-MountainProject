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

3. Install the required dependencies and run server (Django):
   ```
   pip install -r requirements.txt
   python manage.py runserver
   ```

4. Install the required dependencies and run server (Next):
   Open a new bash terminal in root and launch:
   ```
   cd App/Front(React)/narratica
   npm install
   npm run dev
   ```

---

### 4. Connect to the Bastion Host (OPTIONAL)
1. Use the provided `.pem` key file to establish an SSH connection to the bastion host:
   ```
   ssh -i "narratica-bastion-host-key-pair.pem" ec2-user@<Bastion-Host-Public-IP>
   ```
   Replace `<Bastion-Host-Public-IP>` with the actual IP of the bastion host.

This provides you with access to the bastion host for administrative purposes (e.g., troubleshooting or checking logs). However, it doesn’t directly tunnel traffic to the RDS database => OPTIONAL

---

### 5. Create an SSH Tunnel
Set up a secure SSH tunnel to forward your local machine’s port to the RDS database:
```
ssh -i "narratica-bastion-host-key-pair.pem" -L 5432:narratica-db.c5ay4iuoirdg.eu-north-1.rds.amazonaws.com:5432 ec2-user@<Bastion-Host-Public-IP>
```
Replace `<Bastion-Host-Public-IP>` with the actual IP of the bastion host.
Leave this terminal session open to maintain the tunnel.

This step sets up the port forwarding to securely route database traffic from your local machine through the bastion host to the RDS database. Without this, Django or  on your local machine can’t connect to the database.

---

### 6. Run Database Migrations
1. Apply migrations to set up the database schema:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

---

### 7. Import Data from CSV
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

### 8. Verify the Setup
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
1. Connection Issues:
   - Ensure the bastion host is accessible and the SSH tunnel is active.
   - Verify the IP address is allowed in the RDS security group.

2. Migrations Issues:
   - Ensure models are correctly defined in `models.py`.
   - Check if the app is included in `INSTALLED_APPS` in `settings.py`.

3. CSV Import Errors:
   - Confirm the file name and column headers match the expected structure.

---

## Need Help?
For any issues, reach out to the project administrator or check the AWS logs for the Bastion Host and RDS instance.

---