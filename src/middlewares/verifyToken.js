const jwt = require('jsonwebtoken');
const User=require('../modules/user/models/user.model');

const verifyToken = () => next => async(root, args, context, info) => {
    const {token}=context;
    if (!token) {
        throw new Error('A token is required for authentication');
        // return res.status(403).send("");
    }
    try {
        const decoded = jwt.verify(token, "longer-secret-is-better");
        console.log('decoded user: ', JSON.stringify(decoded));
        const {email, userId}=decoded;
        const user=await User.findOne({userid: userId, email: email}).exec();
        console.log('user from db: ', JSON.stringify(user));
        if (!user) {
            throw new Error("Invalid user");
        }
        context.currentUser=user;
        return next(root, args, context, info);

    } catch (err) {
        console.log('error: ', JSON.stringify(err));
        throw new Error('Invalid Token');
        // return res.status(401).send("");
    }
}

module.exports = verifyToken;