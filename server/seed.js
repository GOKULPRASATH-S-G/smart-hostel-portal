const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const seedRooms = async () => {
    try {
        // 1. Connect to your database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // 2. Clear existing rooms (Optional: Remove if you want to keep old test data)
        await Room.deleteMany({});
        console.log("Cleared old room data.");

        const roomsToCreate = [];

        // 3. Loop through 3 floors
        for (let floor = 1; floor <= 3; floor++) {
            
            // 4. Loop through 10 rooms per floor
            for (let roomIdx = 1; roomIdx <= 10; roomIdx++) {
                
                // Room numbers: 101-110, 201-210, 301-310
                const roomNumber = (floor * 100) + roomIdx;

                // First 5 rooms (1-5) are Single, next 5 (6-10) are Double
                const isSingle = roomIdx <= 5;
                
                roomsToCreate.push({
                    roomNumber: roomNumber.toString(),
                    floor: floor,
                    type: isSingle ? "Single" : "Double",
                    capacity: isSingle ? 1 : 2,
                    price: isSingle ? 500 : 1000, // You can change these prices
                    status: "Available",
                    pendingUsers: [],
                    occupiedBy: []
                });
            }
        }

        // 5. Insert all 30 rooms at once
        await Room.insertMany(roomsToCreate);
        console.log("Successfully created 30 rooms (3 floors, 10 rooms each)!");
        
        process.exit(); // Close the script
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedRooms();