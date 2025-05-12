import boto3
from django.conf import settings
from botocore.client import Config
from botocore.exceptions import NoCredentialsError
from datetime import datetime
from urllib.parse import urlparse
import logging
logger = logging.getLogger(__name__)

def upload_image_to_s3(image_file):
    """
    Uploads an image to AWS S3 and returns the URL of the uploaded image.
    """
    # Get S3 client
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
        config=Config(signature_version='s3v4'), #Ensure that the signature version is correct
    )

    # Prepare file data
    file_name = f"profile_image_{datetime.now().strftime('%Y%m%d%H%M%S')}_{image_file.name}"

    # Upload to S3
    try:
        image_file.seek(0)
        s3.upload_fileobj(
            image_file,
            settings.AWS_STORAGE_BUCKET_NAME,
            file_name,
            ExtraArgs={
                'ACL': 'public-read', 
                'ContentType': image_file.content_type
            }
        )
        
        # Generate the URL to the uploaded image
        s3_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{file_name}"
        return s3_url
    except NoCredentialsError:
        raise Exception("Credentials not available.")
    except Exception as e:
        raise Exception(f"Error uploading to S3: {e}")

def delete_image_from_s3(image_url):
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME

    # Extract the object key from the full URL
    path = urlparse(image_url).path.lstrip("/")
    s3.delete_object(Bucket=bucket_name, Key=path)