const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json('User registered');
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).json('User not found');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json('Wrong password');

        res.status(200).json('Login successful');
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
