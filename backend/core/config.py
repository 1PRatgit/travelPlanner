from typing import List
from pydantic import AnyHttpUrl   
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URL: str
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    ALLOW_ORIGINS: List[AnyHttpUrl] = []

    class Config:
        env_file = ".env"
        case_sensitive = True
        env_file_encoding = 'utf-8'
        
settings = Settings()