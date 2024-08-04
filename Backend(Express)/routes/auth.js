const express = require('express');
const { verifyPassword } = require('../utils/password_hashing');
const { createAccessToken } = require('../oauth2');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check for User or Doctor where username or email matches
        const existingUser = await User.findOne({ $or: [{ userName: username }, { email: username }] });
        const existingDoctor = await Doctor.findOne({ $or: [{ userName: username }, { email: username }] });

        if (existingDoctor) {
            const isMatchDoctor = await verifyPassword(password, existingDoctor.password);
            if (isMatchDoctor) {
                const accessToken = createAccessToken(existingDoctor.id);
                return res.json({ accessToken, role: existingDoctor.role, userId: existingDoctor.id });
            }
            else{
                res.status(401).json({ message: "Invalid credentials" });
            }
        }

        if (existingUser) {
            const isMatchUser = await verifyPassword(password, existingUser.password);
            if (isMatchUser) {
                const accessToken = createAccessToken(existingUser.id);
                return res.json({ accessToken, role: existingUser.role, userId: existingUser.userId });
            }
            else{
                res.status(401).json({ message: "Invalid credentials" });
            }
        }

        res.status(401).json({ message: "Invalid credentials" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});

module.exports = router;
