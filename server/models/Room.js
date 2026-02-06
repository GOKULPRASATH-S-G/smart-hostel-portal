const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    floor: { type: Number, required: true },
    type: { 
        type: String, 
        enum: ['Single', 'Double', 'Triple'], 
        default: 'Single' 
    },
    price: { type: Number, required: true },
    status: { type: String, default: 'Available' }, // Available, Occupied (Full)
    
    // NEW: Capacity logic
    capacity: { type: Number, default: 1 }, 

    // NEW: Arrays to hold multiple students
    pendingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    occupiedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);