from fastapi import HTTPException, status, Depends, APIRouter, Header
from sqlalchemy.orm import session
from datetime import datetime
from typing import List
import pprint


import sys

sys.path.append('BackEnd')

import models
import DataBase
import oauth2
import utils
import schemas

router = APIRouter(
    tags=["Appointment"]
)


@router.post("/add/appointment", status_code=status.HTTP_201_CREATED, description="This is a post request add a new appointment")
async def add_appointment(appointment: schemas.addAppointment, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(appointment.parentId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")

    Appointment = db.query(models.Appointment).filter(models.Appointment.appointmentDate == appointment.appointmentDate).filter(models.Appointment.fromTime == appointment.From).filter(models.Appointment.toTime == appointment.To).first()
    if Appointment:
        return {"message": " Appointment already exists"}
    new_appointment = models.Appointment(
        parentId = appointment.parentId,
        doctorId = appointment.doctorId,
        patientId = appointment.patientId,
        appointmentDate = appointment.appointmentDate,
        fromTime = appointment.From,
        toTime = appointment.To,
        isTaken = appointment.isTaken,
        Paied = False
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    if not db.query(models.MRAccess).filter(models.MRAccess.patientId == appointment.patientId).filter(models.MRAccess.doctorId == appointment.doctorId).first():
        mra = models.MRAccess(
            patientId = appointment.patientId,
            doctorId = appointment.doctorId
        )
        db.add(mra)
        db.commit()
        db.refresh(mra)
    
    return{"message": "Appointment added successfully"}


@router.post("/add/appointment/{adminId}", status_code=status.HTTP_201_CREATED, description="This is a post request add a new appointment")
async def add_appointment(appointment: schemas.addAppointment, adminId:int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")

    Appointment = db.query(models.Appointment).filter(models.Appointment.appointmentDate == appointment.appointmentDate).filter(models.Appointment.fromTime == appointment.From).filter(models.Appointment.toTime == appointment.To).first()
    if Appointment:
        return {"message": " Appointment already exists"}
    new_appointment = models.Appointment(
        parentId = appointment.parentId,
        doctorId = appointment.doctorId,
        patientId = appointment.patientId,
        appointmentDate = appointment.appointmentDate,
        fromTime = appointment.From,
        toTime = appointment.To,
        isTaken = appointment.isTaken,
        Paied = False
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    if not db.query(models.MRAccess).filter(models.MRAccess.patientId == appointment.patientId).filter(models.MRAccess.doctorId == appointment.doctorId).first():
        mra = models.MRAccess(
            patientId = appointment.patientId,
            doctorId = appointment.doctorId
        )
        db.add(mra)
        db.commit()
        db.refresh(mra)
    
    return{"message": "Appointment added successfully"}

@router.get("/get/appointment/{parentId}", status_code=status.HTTP_200_OK, description="This is a get request to get all appointments of a patient")
async def get_appointment(parentId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(parentId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")
    appointments = db.query(models.Appointment).filter(models.Appointment.parentId == parentId).all()
    Data = []
    for apointment in appointments:
        user = db.query(models.User).filter(models.User.userId == apointment.parentId).first()
        patient = db.query(models.Patient).filter(models.Patient.id == apointment.patientId).first()
        doctor = db.query(models.Doctor).filter(models.Doctor.id == apointment.doctorId).first()
        appointment_date = apointment.appointmentDate
        
        Data.append({
            "id": apointment.id,
            "parentId": user.userId,
            "patientId": patient.id,
            "doctorId": apointment.doctorId,
            "patientFirstName": patient.firstName,
            "parentFirstName": user.firstName,
            "parentLastName": user.lastName,
            "parentPic": user.profilePicture,
            "doctorPic": doctor.profilePicture,
            "doctorFirstName": doctor.firstName,
            "doctorLastName": doctor.lastName,
            "appointmentDate": appointment_date,
            "From": apointment.fromTime,
            "To": apointment.toTime,
            "isTaken": apointment.isTaken,
            "Paied": apointment.Paied
        })
    return Data


@router.get("/get/doctor/appointments/table/{doctorId}/{userId}", status_code=status.HTTP_200_OK, description="This is a get request to get all appointments of a patient")
async def get_appointment(doctorId: int, userId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    appointments = db.query(models.Appointment).filter(models.Appointment.doctorId == doctorId).all()
    Data = []
    for apointment in appointments:
        user = db.query(models.User).filter(models.User.userId == apointment.parentId).first()
        patient = db.query(models.Patient).filter(models.Patient.id == apointment.patientId).first()
        appointment_date = apointment.appointmentDate
        
        Data.append({
            "appointmentId": apointment.id,
            "parentId": user.userId,
            "patientId": patient.id,
            "patientFirstName": patient.firstName,
            "parentFirstName": user.firstName,
            "parentLastName": user.lastName,
            "parentPic": user.profilePicture,
            "appointmentDate": appointment_date,
            "From": apointment.fromTime,
            "To": apointment.toTime,
            "isTaken": apointment.isTaken,
            "Paied": apointment.Paied
        })
    return Data



@router.get('/get/all/appointments', description="This route returns all appointments")
async def get_appointment(db: session = Depends(DataBase.get_db)):
    
    appointments = db.query(models.Appointment).all()
    Data = []
    
    for appointment in appointments:
        user = db.query(models.User).filter(models.User.userId == appointment.parentId).first()
        patient = db.query(models.Patient).filter(models.Patient.id == appointment.patientId).first()
        doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctorId).first()
        appointment_date = appointment.appointmentDate
        
        
        appointment_data = {
            "appointmentId": appointment.id,
            "parentId": user.userId,
            "patientId": patient.id,
            "doctorId": doctor.id,
            "patientFirstName": patient.firstName,
            "parentFirstName": user.firstName,
            "parentLastName": user.lastName,
            "doctorFirstName": doctor.firstName,
            "doctorLastName": doctor.lastName,
            "parentPic": user.profilePicture,
            "appointmentDate": appointment_date,
            "From": appointment.fromTime,
            "To": appointment.toTime,
            "isTaken": appointment.isTaken,
            "Paied": appointment.Paied
        }
        
        Data.append(appointment_data)
    
    return Data 

@router.get('/get/all/appointments/{adminId}', description="This route returns all appointments")
async def get_appointment(adminId:int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    appointments = db.query(models.Appointment).all()
    Data = []
    
    for appointment in appointments:
        user = db.query(models.User).filter(models.User.userId == appointment.parentId).first()
        patient = db.query(models.Patient).filter(models.Patient.id == appointment.patientId).first()
        doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctorId).first()
        appointment_date = appointment.appointmentDate
        
        appointment_data = {
            "id": appointment.id,
            "patientFirstName": patient.firstName,
            "parentFirstName": user.firstName,
            "parentLastName": user.lastName,
            "doctorFirstName": doctor.firstName,
            "doctorLastName": doctor.lastName,
            "doctorId": doctor.id,
            "appointmentDate": appointment_date,
            "From": appointment.fromTime,
            "To": appointment.toTime,
            "Paied": appointment.Paied
        }
        
        Data.append(appointment_data)
    
    return Data 



@router.get("/get/all/appointments/table/{adminId}", status_code=status.HTTP_200_OK, description="This is a get request to get all appointments of a patient")
async def get_appointment(adminId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    appointments = db.query(models.Appointment).all()
    Data = []
    
    for appointment in appointments:
        user = db.query(models.User).filter(models.User.userId == appointment.parentId).first()
        patient = db.query(models.Patient).filter(models.Patient.id == appointment.patientId).first()
        doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctorId).first()
        appointment_date = appointment.appointmentDate
        
        appointment_data = {
            "appointmentId": appointment.id,
            "parentId": user.userId,
            "patientId": patient.id,
            "doctorId": doctor.id,
            "patientFirstName": patient.firstName,
            "parentFirstName": user.firstName,
            "parentLastName": user.lastName,
            "doctorFirstName": doctor.firstName,
            "doctorLastName": doctor.lastName,
            "parentPic": user.profilePicture,
            "appointmentDate": appointment_date,
            "From": appointment.fromTime,
            "To": appointment.toTime,
            "isTaken": appointment.isTaken,
            "Paied": appointment.Paied
        }
        
        Data.append(appointment_data)
    
    return Data

@router.get('/get/appointment/{appointmentId}/{adminId}') 
async def get_appointment(appointmentId:int, adminId:int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointmentId).first()
    user = db.query(models.User).filter(models.User.userId == appointment.parentId).first()
    patient = db.query(models.Patient).filter(models.Patient.id == appointment.patientId).first()
    doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctorId).first()
    appointment_date = appointment.appointmentDate
   
    appointment_data = {
        "id": appointment.id,
        "patientFirstName": patient.firstName,
        "parentFirstName": user.firstName,
        "parentLastName": user.lastName,
        "doctorFirstName": doctor.firstName,
        "doctorLastName": doctor.lastName,
        "doctorId": doctor.id,
        "appointmentDate": appointment_date,
        "From": appointment.fromTime,
        "To": appointment.toTime,
        "Paied": appointment.Paied
    }
        
    
    return appointment_data 

@router.get('/get/all/appointments/{staffId}', description="This route returns all appointments")
async def get_all_appointments(staffId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(staffId, token)
    if not token_data:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    appointments = db.query(models.Appointment).all()
    Data = []
    
    for appointment in appointments:
        user = db.query(models.User).filter(models.User.userId == appointment.parentId).first()
        patient = db.query(models.Patient).filter(models.Patient.id == appointment.patientId).first()
        doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctorId).first()
        appointment_date = appointment.appointmentDate
        
        appointment_data = {
            "appointmentId": appointment.id,
            "parentId": user.userId,
            "patientId": patient.id,
            "doctorId": doctor.id,
            "patientFirstName": patient.firstName,
            "parentFirstName": user.firstName,
            "parentLastName": user.lastName,
            "doctorFirstName": doctor.firstName,
            "doctorLastName": doctor.lastName,
            "parentPic": user.profilePicture,
            "appointmentDate": appointment_date,
            "From": appointment.fromTime,
            "To": appointment.toTime,
            "isTaken": appointment.isTaken,
            "Paied": appointment.Paied
        }
        
        Data.append(appointment_data)
    
    # Print the response structure for inspection
    pprint.pprint(Data)

    return Data



@router.put('/update/appointments/{adminId}/{appointmentId}', description="This route updates the appointment's info")
async def update_appointments(
    adminId: int,
    appointmentId: int,
    appointment: schemas.updateAppointment,
    Authorization: str = Header(None),
    db: session = Depends(DataBase.get_db)
):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException(status_code=401, detail="unauthorized")
    
    appointment_query = db.query(models.Appointment).filter(models.Appointment.id == appointmentId)
    existing_appointment = appointment_query.first()
    
    if not existing_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    update_data = {
        "doctorId":appointment.doctorId if appointment.doctorId is not None else existing_appointment.doctorId,
        "appointmentDate": appointment.appointmentDate if appointment.appointmentDate is not None else existing_appointment.appointmentDate,
        "fromTime": appointment.From if appointment.From is not None else existing_appointment.fromtime,
        "toTime": appointment.To if appointment.To is not None else existing_appointment.toTime,
        "isTaken": True
    }

    appointment_query.update(update_data)
    db.commit()

    new_appointment = appointment_query.first()

    return new_appointment


@router.delete("/delete/appointment/{appointmentId}/{adminId}", status_code=status.HTTP_200_OK, description="This is a delete request to delete an appointment")
async def delete_appointment(appointmentId: int, adminId:int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(adminId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointmentId).first()
    mra = db.query(models.MRAccess).filter(models.MRAccess.patientId == appointment.patientId).filter(models.MRAccess.doctorId == appointment.doctorId).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found.")
    db.delete(appointment)
    db.commit()
    appointment = db.query(models.Appointment).filter(models.Appointment.patientId == appointment.patientId).filter(models.Appointment.doctorId == appointment.doctorId).first()
    if not appointment:
        db.delete(mra)
        db.commit()
    return {"message": "Patient deleted successfully"}
