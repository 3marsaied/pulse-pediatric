const express = require('express');
const {hashPassword} = require('../utils/password_hashing');
const {createAccessToken, verifyAccessToken, authenticateToken} = require('../oauth2');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const MRA = require('../models/MRAccess');
const Reviews = require('../models/Reviews');
const router = express.Router();

router.post('/add/patient', authenticateToken, async (req, res) => {
    const {firstName, lastName, age, gender, parentId} = req.body;
    try{
        const existingPatient = await Patient.findOne({firstName} && {parentId});
        if(existingPatient){
            return res.status(409).json({detail: "Patient with the same first name and parent already exists"});
        }
        const existingParent = await User.findOne({userId: parentId});
        if(!existingParent){
            return res.status(404).json({detail: "Parent not found"});
        }
        const newPatient = new Patient(
        {
            firstName,
            lastName,
            age,
            gender,
            parentId
        });
        newPatient.save();
        res.status(201).json({detail: "Patient added successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});



module.exports = router