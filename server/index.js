const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Add this line
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Update this line

console.log("1. Libraries loaded...");
console.log("DEBUG: MONGO_URI is:", process.env.MONGO_URI); // Add this to check if it's working
require('dotenv').config();

console.log("1. Libraries loaded...");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
console.log("2. Middleware initialized...");

// Routes
app.use('/api/auth', require('./routes/auth')); // You already have this
app.use('/api/rooms', require('./routes/rooms')); 
// We wrap this in a try-catch to see if the error is inside auth.js
try {
    app.use('/api/auth', require('./routes/auth'));
    console.log("3. Routes connected...");
} catch (error) {
    console.log("❌ Error loading routes:", error);
}

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.log("❌ ERROR: MONGO_URI is missing in .env file!");
}

mongoose.connect(mongoURI)
    .then(() => console.log("✅ 4. MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Start Server

const PORT = process.env.PORT || 5000; 

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});