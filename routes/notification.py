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

    newFcmToken = models.fcm(
        fcmToken = fcmData.fcmToken,
        userId = fcmData.userId,
    )

    db.add(newFcmToken)
    db.commit()
    db.refresh(newFcmToken)
    return {"message": "FCM Token added successfully."}