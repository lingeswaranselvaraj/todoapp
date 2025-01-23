const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Unique user ID
    email: { type: String, required: true, unique: true }  // User's email
});

module.exports = mongoose.model('User', UserSchema);