const jwt = require("jsonwebtoken");
const secretKey = 'Sandeep20@06';

function setUser(user){
    return jwt.sign({
        _id : user._id,
        userName : user.userName,
    }, secretKey);
}

function getUser(token){
    if(!token){
        return null;
    }else{
        const user = jwt.verify(token, secretKey);
        return user;
    }
}

module.exports = {
    setUser,
    getUser,
};