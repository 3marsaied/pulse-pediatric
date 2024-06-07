from fastapi import HTTPException, status, Depends, APIRouter, Header
from sqlalchemy.orm import session

import sys

sys.path.append('BackEnd')

import models
import DataBase
import oauth2
import utils
import schemas

router = APIRouter(
    tags=["user"]
)


@router.post("/signup", status_code=status.HTTP_201_CREATED, description="This is a post request to create a regular user (customer).", response_model=schemas.LoginResponse)
async def CreateUser(user: schemas.userSginup, db: session = Depends(DataBase.get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.userName == user.userName) | (models.User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with the same username or email already exists"
        )

    # Hash the password before creating the user
    hashed_password = utils.hash(user.password)
    
    # Create a new instance of the User model with the hashed password
    new_user = models.User(userName=user.userName, email=user.email, password=hashed_password, firstName = user.firstName, lastName = user.lastName, PhoneNumber = user.phone, role = "customer", profilePicture = 'https://i.imgur.com/9g7aq8u.png')
    
    # Add the new_user instance to the session
    db.add(new_user)
    
    # Commit the session to persist the changes
    db.commit()
    
    # Refresh the new_user instance to ensure it has the latest data from the database
    db.refresh(new_user)
    
    # Generate an access token for the new user
    access_token = oauth2.create_access_token(data={"user_id": new_user.userId, "type": "user"})
    
    # Return the response with the access token, role, and userId
    return {"accessToken": access_token, "role": new_user.role, "userId": new_user.userId}




@router.post("/add/user/{adminId}", status_code=status.HTTP_201_CREATED, description="This is a post request to create a regular user (customer).", response_model=schemas.LoginResponse)
async def addUser(user: schemas.addUser, adminId: int, token: str, db: session = Depends(DataBase.get_db)):
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")
    admin = db.query(models.User).filter(models.User.userId == adminId).first()
    if admin.role != 'admin':
        raise HTTPException( status_code=401, detail= "unauthorized")
    existing_user = db.query(models.User).filter(
        (models.User.userName == user.userName) | (models.User.email == user.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with the same username or email already exists"
        )

    # Hash the password before creating the user
    hashed_password = utils.hash(user.password)
    
    # Create a new instance of the User model with the hashed password
    new_user = models.User(userName=user.userName, email=user.email, password=hashed_password, firstName = user.firstName, lastName = user.lastName, PhoneNumber = user.phone, role = user.role, profilePicture = 'https://i.imgur.com/9g7aq8u.png')
    
    # Add the new_user instance to the session
    db.add(new_user)
    
    # Commit the session to persist the changes
    db.commit()
    
    # Refresh the new_user instance to ensure it has the latest data from the database
    db.refresh(new_user)
    
    # Generate an access token for the new user
    access_token = oauth2.create_access_token(data={"user_id": new_user.userId, "type": "user"})
    
    # Return the response with the access token, role, and userId
    return {"accessToken": access_token, "role": new_user.role, "userId": new_user.userId}



@router.get("/get/user/{userId}", description="This route returns user data via userId and takes the token in the header", response_model=schemas.User)
async def get_user_by_id(userId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    
    if not token_data:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user = db.query(models.User).filter(models.User.userId == userId).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Construct the user data dictionary using the schema structure
    user_data = {
        "userId": user.userId,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "userName": user.userName,
        "createdAt": str(user.createdAt),  # Convert datetime to string
        "phone": user.PhoneNumber,
        "age": user.age,  # Will be None if age is None
        "profilePicture": user.profilePicture,  # Will be None if profilePicture is None
        "role": user.role
    }

    return user_data


@router.get("/get/user/{userId}/{adminId}", description="This route returns user data via userId and takes the token in the header", response_model=schemas.User)
async def get_user_by_id(userId: int, adminId: int, token: str, db: session = Depends(DataBase.get_db)):
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")
    admin = db.query(models.User).filter(models.User.userId == adminId).first()
    if not admin: 
        raise HTTPException( status_code=401, detail= "unauthorized")
    
    user = db.query(models.User).filter(models.User.userId == userId).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Construct the user data dictionary using the schema structure
   # Construct the user data dictionary using the schema structure
    user_data = {
        "userId": user.userId,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "userName": user.userName,
        "createdAt": str(user.createdAt),  # Convert datetime to string
        "phone": user.PhoneNumber,
        "age": user.age,  # Will be None if age is None
        "profilePicture": user.profilePicture,  # Will be None if profilePicture is None
        "role": user.role
    }

    return user_data


@router.get('/get/all/users/{adminId}', description="This route returns all users", response_model=list[schemas._User])
async def get_all_users(adminId: int, token: str, db: session = Depends(DataBase.get_db)):
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    admin = db.query(models.User).filter(models.User.userId == adminId).first()
    if not admin:
        raise HTTPException( status_code=401, detail= "unauthorized")
    users = db.query(models.User).all()
    newUsers =[]
    for user in users:
        newUser ={
        "id": user.userId,
        "userName": user.userName,
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "createdAt": str(user.createdAt),  # Convert datetime to string
        "phone": user.PhoneNumber,  # Changed from PhoneNumber to phone
        "age": user.age,  # Will be None if age is None
        "profilePicture": user.profilePicture,  # Will be None if profilePicture is None
        "role": user.role
        }
        newUsers.append(newUser)

    return newUsers

@router.get('/get/Number/of/users/{adminId}', description="This route returns the doctor's reviews")
async def getUserTotalPrice(adminId: int, token: str, db: session = Depends(DataBase.get_db)):
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    admin = db.query(models.User).filter(models.User.userId == adminId).first()
    if admin.role != 'admin':
        raise HTTPException( status_code=401, detail= "unauthorized")
    users = db.query(models.User).all()
    customers = 0
    admins = 0
    staff = 0
    for user in users:
        if user.role == 'customer':
            customers += 1
        elif user.role == 'admin':
            admins += 1
        elif user.role =='staff':
            staff += 1
    return {"totalNumberOfCustomers":customers, "totalNumberOfAdmins":admins, "totalNumberOfStaff":staff}

@router.put("/update/user/{userId}", description="This route updates the user's info", response_model = schemas.User)
async def update_user(user: schemas.updateUser, userId: int,Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId ,token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Hash the password before creating the user
    X = db.query(models.User).filter(models.User.userName == user.userName, models.User.userId != userId).first()
    if X:
        raise HTTPException(status_code=400, detail="Invalid userName")
    
    X = db.query(models.User).filter(models.User.email == user.email, models.User.userId != userId).first()
    if X:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    User = db.query(models.User).filter(models.User.userId == userId).first()
    if( user.password == "" ):
        hashed_password = User.password
    else:
        hashed_password = utils.hash(user.password)
    
    user_query = db.query(models.User).filter(models.User.userId == userId)
    user_query.update({
        "userName": user.userName, 
        "email": user.email, 
        "password": hashed_password, 
        "firstName": user.firstName, 
        "lastName": user.lastName,
        "profilePicture":user.profilePicture, 
        "PhoneNumber": user.phoneNumber,
        "age": user.age
        })
    
    db.commit()

    user= db.query(models.User).filter(models.User.userId == userId).first()
    newUser ={
        "userId": user.userId,
        "userName": user.userName,
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "createdAt": str(user.createdAt),  # Convert datetime to string
        "phone": user.PhoneNumber,  # Changed from PhoneNumber to phone
        "age": user.age,  # Will be None if age is None
        "profilePicture": user.profilePicture,  # Will be None if profilePicture is None
        "role": user.role
    }
    
    return newUser



@router.put("/update/user/admin/{adminId}", description="This route updates the user's info by admin", response_model = schemas.User)
async def update_user(user: schemas.udate_user, adminId: int, token: str, db: session = Depends(DataBase.get_db)):
    token_data = oauth2.verify_access_token(adminId ,token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    admin = db.query(models.User).filter(models.User.userId == adminId).first()
    if admin.role != 'admin':
        raise HTTPException( status_code=401, detail= "unauthorized")

    # Hash the password before creating the user
    X = db.query(models.User).filter(models.User.userName == user.userName, models.User.userId != user.userId).first()
    if X:
        raise HTTPException(status_code=400, detail="Invalid userName")
    
    X = db.query(models.User).filter(models.User.email == user.email, models.User.userId != user.userId).first()
    if X:
        raise HTTPException(status_code=400, detail="Invalid email")
    User = db.query(models.User).filter(models.User.userId == user.userId).first()
    if( user.password == "" ):
        hashed_password = User.password
    else:
        hashed_password = utils.hash(user.password)

    user_query = db.query(models.User).filter(models.User.userId == user.userId)
    user_query.update({
        "userName": user.userName, 
        "email": user.email, 
        "password": hashed_password, 
        "firstName": user.firstName, 
        "lastName": user.lastName,
        "profilePicture":user.profilePicture, 
        "PhoneNumber": user.phoneNumber,
        "age": user.age,
        "role": user.role
        })
    
    db.commit()

    User= db.query(models.User).filter(models.User.userId == user.userId).first()
    newUser ={
        "userId": User.userId,
        "userName": User.userName,
        "email": User.email,
        "firstName": User.firstName,
        "lastName": User.lastName,
        "createdAt": str(User.createdAt),  # Convert datetime to string
        "phone": User.PhoneNumber,  # Changed from PhoneNumber to phone
        "age": User.age,  # Will be None if age is None
        "profilePicture": User.profilePicture,  # Will be None if profilePicture is None
        "role": User.role
    }
    
    return newUser




@router.delete("/delete/user/{userId}/{adminId}", description="This route deletes the user")
async def delete_user(userId: int, adminId: int, token: str, db: session = Depends(DataBase.get_db)):
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    admin = db.query(models.User).filter(models.User.userId == adminId).first()
    if admin.role != 'admin':
        raise HTTPException( status_code=401, detail= "unauthorized")
    user = db.query(models.User).filter(models.User.userId == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    appointments = db.query(models.Appointment).filter(models.Appointment.parentId == userId).all()
    for appointment in appointments:
        db.delete(appointment)
    
    patients = db.query(models.Patient).filter(models.Patient.parentId == userId).all()
    for patient in patients:
        db.delete(patient)
    
    db.delete(user)
    db.commit()
    return{"message": "User deleted successfully"}