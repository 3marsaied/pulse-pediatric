from fastapi import HTTPException, Depends, APIRouter, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import session
import sys

sys.path.append('BackEnd')
import models as models
import DataBase as DataBase
import oauth2 as oauth2
import schemas as schemas
import utils as utils

router = APIRouter(tags=["authentication"])

@router.post("/login", description="This route is for user or doctor login", response_model=list[schemas.UserLoginResponse])
async def user_login(login_info: schemas.UserLogin, db: session = Depends(DataBase.get_db)):
    isDoctor = False
    userInfo = login_info
    user = (
        db.query(models.Doctor)
        .filter(models.Doctor.userName == userInfo.username)
        .first()
    )
    isDoctor = True
    if not user:
        # If not found among doctors, check users
        user = (
            db.query(models.User)
            .filter(models.User.userName == userInfo.username)
            .first()
        )
        isDoctor = False
        if not user:
            # If still not found, check emails
            user = (
                db.query(models.User)
                .filter(models.User.email == userInfo.username)
                .first()
            )
            isDoctor = False
            if not user:
                user = (
                    db.query(models.Doctor)
                    .filter(models.Doctor.email == userInfo.username)
                    .first()
                )
                isDoctor = True
                if not user:
                    raise HTTPException(status_code=403, detail="User not found")
                
    
    if not utils.verify_password(login_info.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    # Create an access token
    if isDoctor:
        access_token = oauth2.create_access_token(data={"user_id": user.id, "type": "doctor"})
        return [{"accessToken":access_token, "role":user.role, "userId":user.id}]

    if not isDoctor:
        access_token = oauth2.create_access_token(data={"user_id": user.userId, "type": "user"})
        return [{"accessToken":access_token, "role":user.role, "userId":user.userId}]
