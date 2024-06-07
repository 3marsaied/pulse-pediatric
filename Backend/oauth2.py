from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import session
from dotenv import load_dotenv
import os

import sys
sys.path.append('BackEnd')

import models
import DataBase
import oauth2
import utils
import schemas
from routes import user
load_dotenv()
# Define your SECRET_KEY and ALGORITHM
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 50000

# Create an access token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({'exp': expire})

    encoded_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_token

# Verify an access token
def verify_access_token(id: int, token: str, credentials_exception=None):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")

        if not user_id:
            if credentials_exception:
                raise credentials_exception
            else:
                return False
        if user_id != id:
            return False
        
        return True
    
    except JWTError:
        if credentials_exception:
            raise credentials_exception
        else:
            return False
        


