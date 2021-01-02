const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const isValidToken = jwt.verify(token, "taskapp")
        
        const user = await User.findOne({ _id: isValidToken._id, 'tokens.token': token })
        
        if (!user) {
            throw new Error();
        }
        req.token=token
        req.user = user;
        console.log("Inside auth")
        next()
        
    } catch (error) {
        res.status(401).send({error:"Authentication fail"})
    }
   
}

module.exports=auth