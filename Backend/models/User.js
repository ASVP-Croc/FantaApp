const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamsJoined: [{
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    totalPoints: { type: Number, required: true, default: 0}}],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);