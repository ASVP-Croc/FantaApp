const { trusted } = require('mongoose');
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coach: { type: String, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: trusted
    },
    inviteCode: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);