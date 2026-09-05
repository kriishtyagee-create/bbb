import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'sih_26044_super_secret_production_ready_jwt_key_ayush_platform_2024_secure')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'sih_26044_jwt_key_ayush_all_india_institute_of_ayurveda_secure_token_2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # SQLite default, easily switchable to PostgreSQL via DATABASE_URL
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(BASE_DIR, 'sih_ayush_portal.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload configurations
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max
    
    CORS_HEADERS = 'Content-Type'
