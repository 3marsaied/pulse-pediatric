import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv('DB_URL')

# Establish database connection
try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    connected = True
except SQLAlchemyError as e:  # Ensure SQLAlchemyError is imported correctly
    print(f"An error occurred while connecting to the database: {e}")
    connected = False

if connected:
    print("Connected to the database.")
else:
    print("Not connected to the database.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
