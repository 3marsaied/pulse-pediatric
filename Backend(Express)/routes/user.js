const express = require('express');
const {hashPassword} = require('../utils/password_hashing');
const {createAccessToken, verifyAccessToken, authenticateToken} = require('../oauth2');
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

        const user_id = newUser.userId;
        const accessToken = createAccessToken({user_id});;

        res.status(201).json({ accessToken: accessToken, role: newUser.role, userId: newUser.userId});
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});

router.post('/add/user/:adminId', authenticateToken, async (req, res) => {
    let { adminId } = req.params;
    adminId = parseInt(adminId, 10);
    const { userName, email, password, firstName, lastName, phone, role } = req.body;
    try {
        const admin = await User.findOne({ userId: adminId });
        if (admin.role!=='admin') {
            return res.status(403).json({ detail: "Not an Admin" });
        }
        // Check if user with same username or email already exists
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(409).json({ detail: "User with the same username or email already exists" });
        }
        // Verify if the admin is authorized to perform this action
        const auth = verifyAccessToken(req.token, adminId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }

        // Hash password and create new user
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            PhoneNumber: phone,
            role: role
        });
        await newUser.save();
        res.status(200).json({ detail: "User added successfully" });
    } catch (error) {
        res.status(500).json({ detail: "Internal Server Error" });
    }
});



router.get('/get/user/:userId', authenticateToken, async (req, res) => {
    let { userId } = req.params;
    userId = parseInt(userId, 10);
    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }
        const auth = verifyAccessToken(req.token, userId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }
        newUser = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
            createdAt: user.createdAt,
            Phone: user.PhoneNumber,
            age: user.age,
            profilePicture: user.profilePicture,
            role: user.role
        }
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ detail: "Internal Server Error" });
    }
})

router.get('/get/user/:userId/:adminId', authenticateToken, async (req, res) => {
    let { userId, adminId } = req.params;
    adminId = parseInt(adminId, 10);
    userId = parseInt(userId, 10);
    try {
        const admin = await User.findOne({ userId: adminId });
        if (admin.role!=='admin') {
            return res.status(403).json({ detail: "Not an Admin" });
        }
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }
        const auth = verifyAccessToken(req.token, adminId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }
        newUser = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
            createdAt: user.createdAt,
            Phone: user.PhoneNumber,
            age: user.age,
            profilePicture: user.profilePicture,
            role: user.role
        }
        res.status(200).json(newUser);
    }catch (error) {
        res.status(500).json({ detail: "Internal Server Error" });
    }
})

router.get('/get/all/users/:adminId', authenticateToken, async (req, res) => {
    let { adminId } = req.params;
    adminId = parseInt(adminId, 10);
    try {
        const admin = await User.findOne({ userId: adminId });
        if (admin.role!=='admin') {
            return res.status(403).json({ detail: "Not an Admin" });
        }
        const auth = verifyAccessToken(req.token, adminId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }
        const users = await User.find();
        const newUsers = [];

        for (const user of users) {
            const newUser = {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userName: user.userName,
                createdAt: user.createdAt,
                Phone: user.PhoneNumber,
                age: user.age,
                profilePicture: user.profilePicture,
                role: user.role
            };
            newUsers.push(newUser);
        }
        res.status(200).json(newUsers);
    } catch (error) {
        res.status(500).json({ detail: "Internal Server Error" });
    }
})

router.get('/get/Number/of/users/:adminId', authenticateToken, async function (req, res) {
    let { adminId } = req.params;
    adminId = parseInt(adminId, 10);
    try {
        const admin = await User.findOne({ userId: adminId});
        console.log(admin)
        adminId = parseInt(adminId, 10);
        if (admin.role!=='admin') {
            return res.status(403).json({ detail: "Not an Admin" });
        }
        const auth = verifyAccessToken(req.token, adminId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }
        const users = await User.find()
        var nAdmin = 0;
        var nUsers = 0;
        var nStaff = 0;
        for(const user of users){
            if(user.role === "admin"){
                nAdmin++;
            } else if(user.role === "customer"){
                nUsers++;
            } else {
                nStaff++;
            }
        }
        res.status(200).json({ totalNumberOfCustomers: nUsers, totalNumberOfAdmins: nAdmin, totalNumberOfStaff: nStaff });
    } catch (error) {
        res.status(500).json({ detail: "Internal Server Error" });
    }
})

router.put('/update/user/:userId', authenticateToken, async function (req, res) {
    let { userId } = req.params;
    userId = parseInt(userId, 10);
    const { firstName, lastName, email, userName, phoneNumber, age, profilePicture, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

        if (existingUser && existingUser.userId !== userId) {
            return res.status(409).json({ detail: "User with the same username or email already exists" });
        }
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }

        const auth = verifyAccessToken(req.token, userId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }

        const updatedUser = {
            firstName: firstName === "" ? user.firstName : firstName,
            lastName: lastName === "" ? user.lastName : lastName,
            email: email === "" ? user.email : email,
            userName: userName === "" ? user.userName : userName,
            password: password === "" ? user.password : await hashPassword(password),
            phoneNumber: phoneNumber === "" ? user.phoneNumber : phoneNumber,
            age: age === null ? user.age : age,
            profilePicture: profilePicture === "" ? user.profilePicture : profilePicture
        };

        await user.updateOne(updatedUser);

        res.status(200).json({ detail: "User updated successfully" });
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ detail: "Internal Server Error" });
    }
});


router.put('/update/user/admin/:adminId', authenticateToken, async function (req, res) {
    let { adminId } = req.params;
    adminId = parseInt(adminId, 10);
    const { firstName, lastName, email, userName, phoneNumber, age, profilePicture, password, role, userId } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

        if (existingUser && existingUser.userId !== userId) {
            return res.status(409).json({ detail: "User with the same username or email already exists" });
        }
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ detail: "User not found" });
        }
        const admin = await User.findOne({userId: adminId});
        if (admin.role!=='admin') {
            return res.status(403).json({ detail: "Not an Admin" });
        }
        const auth = verifyAccessToken(req.token, adminId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }

        const updatedUser = {
            firstName: firstName === "" ? user.firstName : firstName,
            lastName: lastName === "" ? user.lastName : lastName,
            email: email === "" ? user.email : email,
            userName: userName === "" ? user.userName : userName,
            password: password === "" ? user.password : await hashPassword(password),
            phoneNumber: phoneNumber === "" ? user.phoneNumber : phoneNumber,
            age: age === null ? user.age : age,
            profilePicture: profilePicture === "" ? user.profilePicture : profilePicture,
            userId: user.userId,
            role: role === "" ? user.role : role
        };

        await user.updateOne(updatedUser);

        res.status(200).json({ detail: "User updated successfully" });
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ detail: "Internal Server Error" });
    }
});

router.delete('/delete/user/:userId/:adminId', authenticateToken, async function (req, res) {
    let { userId, adminId } = req.params;
    userId = parseInt(userId, 10);
    adminId = parseInt(adminId, 10);
    try {
        const existingUser = await User.findOne({ userId: userId});
        if(!existingUser){
            return res.status(404).json({ detail: "User not found" });
        }
        const admin = await User.findOne({ userId: adminId });
        if (admin.role!=='admin') {
            return res.status(403).json({ detail: "Not an Admin" });
        }
        const auth = verifyAccessToken(req.token, adminId);
        if (!auth) {
            return res.status(403).json({ detail: "Not authorized to perform this action" });
        }
        await existingUser.deleteOne();
        res.status(200).json({ detail: "User deleted successfully" });
    }catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ detail: "Internal Server Error" });
    }
})



module.exports = router;
