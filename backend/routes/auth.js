const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../Models.js');

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  password.length >= 8 && /[!@#$%^&*]/.test(password);

const validateRegistrationData = ({ username, email, password, mobile }) => {
  if (!username || !email || !password || !mobile) {
    return 'All fields are required';
  }
  if (!isValidEmail(email)) {
    return 'Invalid email format';
  }
  if (!isStrongPassword(password)) {
    return 'Password must be at least 8 characters and include a special character';
  }
  return null;
};

router.post('/register', async (req, res) => {
  const { username, email, password, mobile } = req.body;
  const validationError = validateRegistrationData({ username, email, password, mobile });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const existingUser = await User.findOne({
      $or: [
        { email: new RegExp(`^${email}$`, 'i') },
        { username: new RegExp(`^${username}$`, 'i') }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, email, password: hashedPassword, mobile });
    await newUser.save();

    res.status(201).json({ message: 'New user created successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({
      email: new RegExp(`^${email}$`, 'i')
    });

    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    if (existingUser.blocked) {
      return res.status(403).json({ message: 'You are blocked from using this website' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'yourFallbackSecret';
    const token = jwt.sign({ id: existingUser._id }, jwtSecret, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: existingUser._id,
        name: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;