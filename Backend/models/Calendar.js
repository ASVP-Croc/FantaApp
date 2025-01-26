const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    matchdays: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matchday' }],
    season: { type: String, required: true } // e.g., "2023/2024"
});

module.exports = mongoose.model('Calendar', calendarSchema);