const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRE_MINUTES = 50000;

// Create an access token
function createAccessToken(data) {
    const toEncode = { ...data };
    const expire = DateTime.utc().plus({ minutes: ACCESS_TOKEN_EXPIRE_MINUTES }).toJSDate();
    toEncode.exp = expire.getTime() / 1000;

    const encodedToken = jwt.sign(toEncode, SECRET_KEY, { algorithm: ALGORITHM });
    return encodedToken;
}

// Verify an access token
function verifyAccessToken(id, token, credentialsException = null) {
    try {
        const payload = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });
        const userId = payload.user_id;

        if (!userId) {
            if (credentialsException) {
                throw credentialsException;
            } else {
                return false;
            }
        }

        if (userId !== id) {
            return false;
        }

        return true;
    } catch (err) {
        if (credentialsException) {
            throw credentialsException;
        } else {
            return false;
        }
    }
}

// Example route to create token
app.post('/token', (req, res) => {
    const user = req.body; // Assume user object contains necessary info
    const token = createAccessToken({ user_id: user.id });
    res.json({ access_token: token });
});

// Example route to verify token
app.get('/verify', (req, res) => {
    const { id, token } = req.query; // Get id and token from query params
    const valid = verifyAccessToken(parseInt(id, 10), token);
    if (valid) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
