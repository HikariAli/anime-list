const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });

    await newUser.save();

    sendEmail(email, username);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const nodemailer = require('nodemailer');

// Function to send email
const sendEmail = async (email, username) => {
    // Create a Nodemailer transporter using SMTP
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'alimusabai01@gmail.com',
          pass: 'tcts incl azyy jahg'
        }
    });

    // Email content
    let mailOptions = {
        from: 'alimusabai01@gmail.com',
        to: email,
        subject: 'Welcome to our Anime List App!',
        text: `Hello ${username},\n\nThank you for registering with our My Anime List!`
    };

    console.log(mailOptions);

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = router;
