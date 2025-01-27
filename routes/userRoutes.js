const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const tasks=[
    {title: 'to eat', description:'eating habit', deadline:'26/12/2024', priority: 'high'},
];

router.get('/', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/signup', async (req, res) => {
    try {
    const { name, email, password } = req.body;

        const user = new User({ name, email, password });
        await user.save();
        console.log("User Created Successfully");
        res.render('login');

    }

    catch (err) {
       console.log(err);
    }

});
router.post('/login', async (req, res) => {
   try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user){
        throw new Error('Unable to login , user not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Unable to login , invalid password');
    }else{

    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET_KEY );

    res.cookie('jwtt', token, {httpOnly:true });

    res.redirect('/tasks');

   console.log("Logged in successfully");
   }
}
    catch (err) {
        res.status(400).send({ error: err });
        console.log({error: err});
    }
 });

// register a user
// login a user



module.exports = router;