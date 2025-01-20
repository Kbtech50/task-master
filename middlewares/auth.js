const jwt = require('jsonwebtoken');
const User = require('../models/user');



const auth = async (req, res, next) => {

    const token = req.cookies.jwtt;
    try {
       
         
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        const user = await User.findOne({
            _id: decoded._id,
        })

        if (!user) {
            throw new Error('Unable to login , invalid credentials');
            res.locals.user = null;
            next();
    
        }

        req.user = user;
        req.token = token;
        res.locals.user = user;
        next();

    }
    catch (error) { 
        res.status(401).send('Not authorized');
        
    }
}

module.exports = auth;