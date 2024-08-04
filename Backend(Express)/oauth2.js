const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');

dotenv.config();
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
module.exports = { createAccessToken, verifyAccessToken };