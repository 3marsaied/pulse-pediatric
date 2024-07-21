from fastapi import HTTPException, status, Depends, APIRouter, Header
from sqlalchemy.orm import session
from typing import List

import sys

sys.path.append('BackEnd')

import models
import DataBase
import oauth2
import utils
import schemas

router = APIRouter(
    tags=["reviews"]
)

@router.post("/add/review", status_code=status.HTTP_201_CREATED, description="This is a post request add a new review")
async def add_review(review: schemas.reviews, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(review.parentId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")
    
    newReview = models.reviews(parentId=review.parentId, doctorId=review.doctorId, review=review.review, rating = review.rating)
    db.add(newReview)
    db.commit()
    db.refresh(newReview)
    return {'message': "your review has been added successfully"}


@router.get("/get/review/{doctorId}", status_code=status.HTTP_200_OK, description="This is a get request to get all reviews of a patient", response_model=List[schemas.reviewsResponse])
async def get_review(doctorId: int, db: session = Depends(DataBase.get_db)):
    reviews = db.query(models.reviews).filter(models.reviews.doctorId ==doctorId).all()
    reviews_response = []
    for review in reviews:
        doctor = db.query(models.Doctor).filter(models.Doctor.id == review.doctorId).first()
        reviewer = db.query(models.User).filter(models.User.userId == review.parentId).first()
        doctorName = "Dr. " + doctor.firstName + " " + doctor.lastName
        reviewerName = reviewer.firstName + " " + reviewer.lastName
        reviews_response.append(schemas.reviewsResponse(
            reviewerName = reviewerName,
            docotrName = doctorName,
            review = review.review,
            rating = review.rating
        ))
    return reviews_response

@router.get("/get/reviews/barchart/{doctorId}", status_code=status.HTTP_200_OK, description="This is a get request to get all reviews of a patient", response_model=List[schemas.barChart])
async def get_reviews_barchart(doctorId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(doctorId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    reviewsData = []
    i = 5
    while i > 0:
        reviews = db.query(models.reviews).filter(models.reviews.doctorId == doctorId, models.reviews.rating == i).all()
        reviewData = {
            "number": len(reviews),
            "stars": i
        }
        reviewsData.append(reviewData)
        i -= 1
        if i > 5:
            break
    return reviewsData


@router.get("/get/reviews/barchart/{doctorId}/{adminId}", status_code=status.HTTP_200_OK, description="This is a get request to get all reviews of a patient", response_model=List[schemas.barChart])
async def get_reviews_barchart(doctorId: int, adminId:int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    reviewsData = []
    i = 5
    while i > 0:
        reviews = db.query(models.reviews).filter(models.reviews.doctorId == doctorId, models.reviews.rating == i).all()
        reviewData = {
            "number": len(reviews),
            "stars": i
        }
        reviewsData.append(reviewData)
        i -= 1
        if i > 5:
            break
    return reviewsData



@router.get('/get/doctor/avg/rating/{doctorId}', status_code=status.HTTP_200_OK, description="This route returns the average rating of a doctor", response_model = schemas.avgRating)
async def getAvgRating(doctorId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(doctorId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    reviews = db.query(models.reviews).filter(models.reviews.doctorId == doctorId).all()
    totalRating = 0.0
    for review in reviews:
        totalRating += review.rating
    avgRating = round(float(totalRating/len(reviews)),2)
    newData = {
        "avgRating": avgRating,
        "count": len(reviews),
    }
    return newData


@router.get('/get/doctor/avg/rating/{doctorId}/{adminId}', status_code=status.HTTP_200_OK, description="This route returns the average rating of a doctor", response_model = schemas.avgRating)
async def getAvgRating(doctorId: int,adminId:int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    reviews = db.query(models.reviews).filter(models.reviews.doctorId == doctorId).all()
    totalRating = 0.0
    for review in reviews:
        totalRating += review.rating
    avgRating = round(float(totalRating/len(reviews)),2)
    newData = {
        "avgRating": avgRating,
        "count": len(reviews),
    }
    return newData