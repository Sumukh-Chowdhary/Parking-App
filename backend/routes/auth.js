const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../Models.js');

router.post('/register', async (req, res) => {
  const { username, email, password, mobile } = req.body;

  try {
    const existingUser = await User.findOne({
      $or:[{ email },{username}]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, mobile });
    await newUser.save();

    res.status(201).json({ message: 'New User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;

    try{
        const existingUser=await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:'User does not exist'});
        }

        if(existingUser.blocked){
          return res.status(403).json({message:'You are blocked from using this website'})
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: existingUser._id, name: existingUser.username, email: existingUser.email } });
    }catch(err){
        res.status(500).json({message:'Error'});
    }
});

module.exports = router;
