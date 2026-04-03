const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
    try {
        const { token, role } = req.body; 
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // New user: Save with the selected role
            user = new User({ name, email, role: role || 'student' });
            await user.save();
        } else {
            // SECURITY CHECK: Prevents same email being used for two different roles
            if (role && user.role !== role) {
                return res.status(403).json({ 
                    msg: `This email is already registered as a ${user.role.toUpperCase()}. You cannot login as an ${role.toUpperCase()}.` 
                });
            }
        }

        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ 
            token: jwtToken, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                phoneNumber: user.phoneNumber, 
                year: user.year 
            } 
        });
    } catch (err) { 
        res.status(400).json({ msg: "Google Auth Failed" }); 
    }
});

// UPDATE PROFILE (Now updates Name as well)
router.post('/update-profile', async (req, res) => {
    try {
        const { userId, phoneNumber, year, name } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { phoneNumber, year, name }, // Admin will see this 'name'
            { new: true }
        );
        res.json({ user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, phoneNumber: updatedUser.phoneNumber, year: updatedUser.year } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;