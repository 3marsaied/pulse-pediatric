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
    tags=["notification"]
)


@router.post("/add/fcmToken", status_code=status.HTTP_201_CREATED, description="This is a post request to add FCM Token.")
async def addFcmToken(fcmData: schemas.FCM, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(fcmData.userId, token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if db.query(models.fcm).filter(models.fcm.fcmToken == fcmData.fcmToken).first():
        raise HTTPException(status_code=400, detail="FCM Token already exists")

    newFcmToken = models.fcm(
        fcmToken = fcmData.fcmToken,
        userId = fcmData.userId,
    )

    db.add(newFcmToken)
    db.commit()
    db.refresh(newFcmToken)
    return {"message": "FCM Token added successfully."}