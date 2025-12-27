const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, email, ContactNumber, role } = req.body;

    if (!username || !password || !email || !ContactNumber) {
      return res.status(400).json({ err: 'All fields are required' });
    }

    const userInDatabase = await User.findOne({ username });
    if (userInDatabase) {
      return res.status(409).json({ err: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      username,
      email,
      ContactNumber,
      hashedPassword,
      role: role || 'user',
    });

    const payload = {
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error('SIGN-UP ERROR:', err);
    res.status(500).json({ err: err.message });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ err: 'Username or Password is invalid' });
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      user.hashedPassword
    );

    if (!validPassword) {
      return res.status(401).json({ err: 'Username or Password is invalid' });
    }

    const payload = {
      _id: user._id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
