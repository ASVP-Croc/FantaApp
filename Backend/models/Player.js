const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', playerSchema);