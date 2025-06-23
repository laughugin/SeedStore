from typing import List
from pydantic import BaseSettings, AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "SeedStore API"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "seedstore"
    SQLALCHEMY_DATABASE_URI: str = ""
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "diplom-nikita-10af4-firebase-adminsdk-fbsvc-07f70a665a.json"
    
    # ChatGPT
    VITE_OPENAI_API_KEY: str = "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"
    
    # Admin
    SUPERUSER_EMAILS: List[str] = [
        "laughugin@icloud.com",  # Add your admin email here
    ]
    
    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str, values: dict) -> str:
        if isinstance(v, str):
            return v
        return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 