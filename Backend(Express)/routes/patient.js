const express = require('express');
const {hashPassword} = require('../utils/password_hashing');
const {createAccessToken, verifyAccessToken, authenticateToken} = require('../oauth2');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const MRA = require('../models/MRAccess');
const Reviews = require('../models/Reviews');
const router = express.Router();
const MediacalRecord = require('../models/MedicalRecord');

router.post('/add/patient', authenticateToken, async (req, res) => {
    const {firstName, lastName, age, gender, parentId} = req.body;
    try{
        const existingPatient = await Patient.findOne({firstName}, {parentId});
        if(existingPatient){
            return res.status(409).json({detail: "Patient with the same first name and parent already exists"});
        }
        const existingParent = await User.findOne({_id: parentId});
        if(!existingParent){
            return res.status(404).json({detail: "Parent not found"});
        }
        const auth = verifyAccessToken(req.token, parentId)
        if(auth !== parentId){
            return res.status(403).json({detail: "Not authorized to perform this action"});
        }
        const newPatient = new Patient(
        {
            firstName: firstName,
            lastName: lastName,
            age: age,
            gender: gender,
            parentId: parentId,
            parentFirstName: existingParent.firstName,
            parentLastName: existingParent.lastName,
            parentPhoneNumber: existingParent.PhoneNumber
        });
        newPatient.save();
        const newMediacalRecord = new MediacalRecord({
            patientId: newPatient._id,
        })
        newMediacalRecord.save();
        res.status(201).json({detail: "Patient added successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});


router.post('/add/patient/:adminId', authenticateToken, async (req, res) => {
    const {adminId} = req.params;
    const{firstName, lastName, age, gender, parentId} = req.body;
    try{
        const existingPatient = await Patient.findOne({firstName}, {parentId});
        if(existingPatient){
            return res.status(409).json({detail: "Patient with the same first name and parent already exists"});
        }
        const existingParent = await User.findOne({_id: parentId});
        if(!existingParent){
            return res.status(404).json({detail: "Parent not found"});
        }
        const auth = verifyAccessToken(req.token, adminId)
        if(auth !== parentId){
            return res.status(403).json({detail: "Not authorized to perform this action"});
        }
        const newPatient = new Patient(
            {
                firstName: firstName,
                lastName: lastName,
                age: age,
                gender: gender,
                parentId: parentId,
                parentFirstName: existingParent.firstName,
                parentLastName: existingParent.lastName,
                parentPhoneNumber: existingParent.PhoneNumber
            });
            newPatient.save();

            const newMediacalRecord = new MediacalRecord({
                patientId: newPatient._id,
            })
            newMediacalRecord.save();
            res.status(201).json({detail: "Patient added successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});

router.get('/get/patients/:parentId', authenticateToken, async (req, res) => {
    const { parentId } = req.params;
    try{
        const auth = verifyAccessToken(req.token, parentId);
        if(auth !== parentId){
            return res.status(403).json({detail: "Not authorized to perform this action"});
        }
        const patients = await Patient.find({parentId}).select('-__v');
        res.status(200).json(patients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});

router.get('/get/patient/:patientId/:parentId', authenticateToken, async (req, res) => {
    const { patientId, parentId } = req.params;
    try{
        const auth = verifyAccessToken(req.token, parentId);
        if(auth !== parentId){
            return res.status(403).json({detail: "Not authorized to perform this action"});
        }
        const patient = await Patient.findOne({_id: patientId, parentId}).select('-__v');
        if(!patient){
            return res.status(404).json({detail: "Patient not found"});
        }
        res.status(200).json(patient);
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});

router.get('/patientList/:doctorId', authenticateToken, function(req, res){
    const { doctorId } = req.params;
    var patients = [];
    try{
        const auth = verifyAccessToken(req.token, doctorId);
        if(auth !== doctorId){
            return res.status(403).json({detail: "Not authorized to perform this action"});
        }
        MRA.find({doctorId: doctorId, access: true}, function(err, data){
            if(err){
                console.log(err);
                res.status(500).json({detail: "Internal server error"});
            }
            else{
                for(const patientId of data.patientId){
                const patient = Patient.findById({patientId})
                patients.push(patient);
                }}});
                res.status(200).json({patients});
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});


module.exports = router