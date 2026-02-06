const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// 1. ADD ROOM (Auto-set capacity)
router.post('/add', async (req, res) => {
    try {
        let cap = 1;
        if (req.body.type === 'Double') cap = 2;
        if (req.body.type === 'Triple') cap = 3;

        const newRoom = new Room({ ...req.body, capacity: cap });
        await newRoom.save();
        res.status(201).json({ msg: "Room added!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL ROOMS (Populate Arrays)
router.get('/all', async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('pendingUsers', 'name email year phoneNumber')
            .populate('occupiedBy', 'name email year phoneNumber');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. STUDENT APPLIES
router.post('/apply/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);

        if (room.occupiedBy.length >= room.capacity) {
            return res.status(400).json({ msg: "Room is full" });
        }

        if (!room.pendingUsers.includes(userId) && !room.occupiedBy.includes(userId)) {
            room.pendingUsers.push(userId);
            await room.save();
        }
        res.json({ msg: "Application Sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ADMIN APPROVES
router.post('/approve/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);

        room.pendingUsers = room.pendingUsers.filter(id => id.toString() !== userId);
        room.occupiedBy.push(userId);

        if (room.occupiedBy.length >= room.capacity) {
            room.status = 'Occupied';
        }

        await room.save();
        res.json({ msg: "Approved!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. ADMIN DECLINES
router.post('/decline/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);

        room.pendingUsers = room.pendingUsers.filter(id => id.toString() !== userId);
        
        await room.save();
        res.json({ msg: "Declined" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. ADMIN CANCEL BOOKING (NEW)
router.post('/cancel/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const room = await Room.findById(req.params.id);

        // Remove the student from occupied list
        room.occupiedBy = room.occupiedBy.filter(id => id.toString() !== userId);

        // If the room is no longer full, set it back to Available
        if (room.occupiedBy.length < room.capacity) {
            room.status = 'Available';
        }

        await room.save();
        res.json({ msg: "Booking Cancelled!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;