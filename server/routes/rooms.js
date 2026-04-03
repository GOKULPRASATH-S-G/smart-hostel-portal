const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// --- EMAIL HELPER ---
const sendMail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });
    
    const mailOptions = { 
        from: `"Smart Hostel System" <${process.env.EMAIL_USER}>`, 
        to, 
        subject, 
        text 
    };
    
    // Background sending
    transporter.sendMail(mailOptions).catch(err => console.log("Email Error:", err));
};

// 1. GET ALL ROOMS
router.get('/all', async (req, res) => {
    try {
        const rooms = await Room.find().populate('occupiedBy', 'name email year phoneNumber');
        for (let room of rooms) {
            let actualCap = room.capacity || (room.type === 'Double' ? 2 : 1);
            if (room.occupiedBy.length < actualCap && room.status === 'Occupied') {
                room.status = 'Available';
                await room.save();
            }
        }
        res.json(rooms);
    } catch (err) { res.status(500).json(err); }
});

// 2. INSTANT BOOKING (With Smart Admin Notification)
router.post('/book/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);
        const student = await User.findById(userId);

        if (!room) return res.status(404).json({ msg: "Room not found" });

        const maxCap = room.capacity || (room.type === 'Double' ? 2 : 1);

        if (room.occupiedBy.length >= maxCap) {
            return res.status(400).json({ msg: "This room is full." });
        }

        const existingRoom = await Room.findOne({ occupiedBy: userId });
        if (existingRoom) {
            return res.status(400).json({ msg: `You already have a stay in Room ${existingRoom.roomNumber}` });
        }

        room.occupiedBy.push(userId);
        if (room.occupiedBy.length >= maxCap) {
            room.status = 'Occupied';
        }

        await room.save();

        // --- EMAIL 1: TO STUDENT ---
        sendMail(
            student.email, 
            "🏠 Booking Confirmed", 
            `Hello ${student.name},\n\nYour booking for Room no. ${room.roomNumber} (${room.type} Cot) is successful!`
        );

        // --- EMAIL 2: TO ALL REGISTERED ADMINS ---
        // This finds everyone in your database who selected "Admin" during signup
        const admins = await User.find({ role: 'admin' });
        
        const adminEmailContent = `A new room has been booked through the portal.\n\n` +
            `--- STUDENT DETAILS ---\n` +
            `Name: ${student.name}\n` +
            `Email: ${student.email}\n` +
            `Year: ${student.year}\n` +
            `Phone: ${student.phoneNumber}\n\n` +
            `--- ROOM DETAILS ---\n` +
            `Room No: ${room.roomNumber}\n` +
            `Type: ${room.type}\n` +
            `Total Occupancy: ${room.occupiedBy.length}/${maxCap}`;

        admins.forEach(admin => {
            sendMail(admin.email, "🔔 New Booking Alert", adminEmailContent);
        });

        res.json({ msg: "Booked Successfully!" });
    } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

// 3. ADMIN CANCEL
router.post('/cancel/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);
        const student = await User.findById(userId);

        room.occupiedBy = room.occupiedBy.filter(id => id.toString() !== userId.toString());
        room.status = 'Available';
        await room.save();

        if (student) {
            sendMail(
                student.email, 
                "⚠️ Stay Cancelled", 
                `Hello ${student.name},\n\nYour booking for Room no. ${room.roomNumber} has been removed by the administrator.`
            );
        }

        res.json({ msg: "Cancelled Successfully" });
    } catch (err) { res.status(500).json(err); }
});

// 4. ADD NEW ROOM
router.post('/add', async (req, res) => {
    try {
        const { roomNumber, floor, type, price } = req.body;
        let cap = (type === 'Double') ? 2 : 1;
        const newRoom = new Room({ roomNumber, floor, type, price, capacity: cap, status: 'Available', occupiedBy: [] });
        await newRoom.save();
        res.status(201).json({ msg: "Added" });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;