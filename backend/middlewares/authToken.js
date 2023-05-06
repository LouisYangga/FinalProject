const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const protect = asyncHandler(async(req, res, next) => {
    try {
        let tokenHeaderKey = "" + process.env.TOKEN_HEADER_KEY;
        let jwtSecretKey = "" + process.env.JWT_SECRET_KEY;
        const token = req.header('token');
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            next()
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
})

module.exports = { protect }