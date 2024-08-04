const express = require('express');
const {hashPassword} = require('../utils/password_hashing');
const {createAccessToken} = require('../oauth2');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { userName, email, password, firstName, lastName, phone } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

        if (existingUser) {
            return res.status(409).json({ detail: "User with the same username or email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            PhoneNumber: phone
        });

        await newUser.save();

        const accessToken = createAccessToken({ user_id: newUser._id, type: "user" });

        res.status(201).json({ accessToken: accessToken, role: newUser.role, userId: newUser.userId});
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});

module.exports = router;
