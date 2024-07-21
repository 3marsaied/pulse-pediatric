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
    tags=["Medical Record"]
)



@router.get('/get/medicalRecord/{parentId}/{patientId}', description='this get request returns all the medical records for a certain patient', response_model=list[schemas.medicalRecordResponse])
async def getMedicalRecord(patientId: int, parentId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(parentId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecords = db.query(models.MedicalRecord).filter(models.MedicalRecord.patientId == patientId).all()
    patients = []
    for patient in medicalRecords:
        patient.createdAt = patient.createdAt.isoformat()  # Convert datetime to string
        patients.append(patient)
    
    return patients


@router.get('/getMedicalRecord/{doctorId}/{patientId}', description='this get request returns all the medical records for a certain patient', response_model=list[schemas.medicalRecordResponse])
async def getMedicalRecord(doctorId: int, patientId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(doctorId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    if token_data == False:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecords = db.query(models.MedicalRecord).filter(models.MedicalRecord.patientId == patientId).all()
    patients = []
    for patient in medicalRecords:
        patient.createdAt = patient.createdAt.isoformat()  # Convert datetime to string
        patients.append(patient)
    
    return patients




@router.put('/update/medicalRecord/{patientId}/{docotrId}', description='this update request updates the medical record for a certain patient')
async def updateMedicalRecord(record : schemas.updateMedicalRecord, patientId: int, docotrId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(docotrId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    MR = db.query(models.MedicalRecord).filter(models.MedicalRecord.patientId == patientId)
    MR.update({
       "notes": record.notes,
        "treatment": record.treatment,
        "healthCondition": record.healthCondition,
        "vaccin": record.vaccin,
        "allergies": record.allergies,
        "pastConditions": record.pastConditions,
        "chronicConditions": record.chronicConditions,
        "surgicalHistory": record.surgicalHistory,
        "medications": record.medications,
        "radiologyReport": record.radiologyReport
    })
    db.commit()

    return{"message": "Medical Record updated successfully"}


@router.put('/update/medicalRecord/radiologyReport/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(radiologyReport: schemas.radiologyReportUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "radiologyReport": radiologyReport.radiologyReport
    })
    db.commit()
    return{"message": "Medical Record (radiologyReport) updated successfully"}



@router.put('/update/medicalRecord/medications/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(medications: schemas.medicationsUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "medications": medications.medications
    })
    db.commit()
    return{"message": "Medical Record (medications) updated successfully"}




@router.put('/update/medicalRecord/surgicalHistory/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(surgicalHistory: schemas.surgicalHistoryUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "surgicalHistory": surgicalHistory.surgicalHistory
    })
    db.commit()
    return{"message": "Medical Record (surgicalHistory) updated successfully"}



@router.put('/update/medicalRecord/chronicConditions/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(chronicConditions: schemas.chronicConditionsUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "chronicConditions": chronicConditions.chronicConditions
    })
    db.commit()
    return{"message": "Medical Record (chronicConditions) updated successfully"}



@router.put('/update/medicalRecord/pastConditions/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(pastConditions: schemas.pastConditionsUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "pastConditions": pastConditions.pastConditions
    })
    db.commit()
    return{"message": "Medical Record (pastConditions) updated successfully"}



@router.put('/update/medicalRecord/allergies/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(allergies: schemas.allergiesUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "allergies": allergies.allergies
    })
    db.commit()
    return{"message": "Medical Record (allergies) updated successfully"}



@router.put('/update/medicalRecord/vaccin/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(vaccin: schemas.vaccinUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "vaccin": vaccin.vaccin
    })
    db.commit()
    return{"message": "Medical Record (vaccin) updated successfully"}




@router.put('/update/medicalRecord/healthCondition/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(healthCondition: schemas.healthConditionUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "healthCondition": healthCondition.healthCondition
    })
    db.commit()
    return{"message": "Medical Record (healthCondition) updated successfully"}




@router.put('/update/medicalRecord/treatment/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(treatment: schemas.treatmentUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "treatment": treatment.treatment
    })
    db.commit()
    return{"message": "Medical Record (treatment) updated successfully"}


@router.put('/update/medicalRecord/note/{userId}/{medicalRecordId}', description='this update request updates the medical record notes for a certain patient')
async def update_medicalRecord(note: schemas.NoteUpdate, userId: int, medicalRecordId: int, Authorization: str = Header(None), db: 
    session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId)
    medicalRecord.update({
        "notes": note.notes
    })
    db.commit()
    return{"message": "Medical Record (note) updated successfully"}

@router.delete('/delete/medicalRecord/{userId}/{medicalRecordId}', description='this delete request deletes the medical record for a certain patient')
async def deleteMedicalRecord(userId: int, medicalRecordId: int, Authorization: str = Header(None), db: session = Depends(DataBase.get_db)):
    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    token = Authorization.split(" ")[1]
    token_data = oauth2.verify_access_token(userId, token)
    if not token_data:
        raise HTTPException( status_code=401, detail= "unauthorized")
    medicalRecord = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == medicalRecordId).first()
    if not medicalRecord:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical Record not found.")
    db.delete(medicalRecord)
    db.commit()
    return{"message": "Medical Record deleted successfully"}