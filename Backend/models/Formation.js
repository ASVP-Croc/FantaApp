const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    module: { type: String, required: true }, // e.g., "4-3-3"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Formation', formationSchema);