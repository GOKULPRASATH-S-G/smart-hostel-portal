const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const seedRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // 1. CLEAR EVERYTHING (Start Fresh)
        await Room.deleteMany({});
        console.log("Cleared old room data.");

        const roomsToCreate = [];

        for (let floor = 1; floor <= 3; floor++) {
            for (let roomIdx = 1; roomIdx <= 10; roomIdx++) {
                const roomNumber = (floor * 100) + roomIdx;
                const isSingle = roomIdx <= 5;
                
                roomsToCreate.push({
                    roomNumber: roomNumber.toString(),
                    floor: floor,
                    type: isSingle ? "Single" : "Double",
                    capacity: isSingle ? 1 : 2,
                    price: isSingle ? 500 : 1000,
                    status: "Available",
                    pendingUsers: [], // Empty Array
                    occupiedBy: []    // Empty Array
                });
            }
        }

        await Room.insertMany(roomsToCreate);
        console.log("Successfully created 30 rooms!");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedRooms();