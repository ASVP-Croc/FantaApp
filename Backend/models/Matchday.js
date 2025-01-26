const mongoose = require('mongoose');

const matchdaySchema = new mongoose.Schema({
    number: { type: Number, required: true },
    date: { type: Date, required: true },
    officialFormation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' },
    formations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation' }],
})

module.exports = mongoose.model('Matchday', matchdaySchema);