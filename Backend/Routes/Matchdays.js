const express = require('express');
const router = express.Router({ mergeParams: true });
const Matchday = require('../models/Matchday');
const formationRoutes = require('./Formations');
const Calendar = require('../models/Calendar');
const { verifyToken, checkAdmin } = require('../authMiddleware');
const sanitize = require('mongo-sanitize');

// Crea un nuovo matchday e associarlo al calendario
router.post('/', verifyToken, checkAdmin, async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const sanitizedParams = sanitize(req.params);
    const { calendarId } = sanitizedParams;
    const matchday = new Matchday(sanitizedBody);

    try {
        const newMatchday = await matchday.save();

        const calendar = await Calendar.findById(calendarId);
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }

        calendar.matchdays.push(newMatchday._id);
        await calendar.save();

        res.status(201).json(newMatchday);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ottieni tutti i matchdays di un calendario specifico
router.get('/', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    const { calendarId } = sanitizedParams;

    try {
        const calendar = await Calendar.findById(calendarId).populate('matchdays');
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }

        res.json(calendar.matchdays);
    } catch (err) {
        console.error('Error fetching matchdays:', err);
        res.status(500).json({ message: err.message });
    }
});

// Ottieni un singolo matchday tramite il suo ID
router.get('/:matchdayId', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    const { matchdayId } = sanitizedParams;

    try {
        const matchday = await Matchday.findById(matchdayId);
        if (!matchday) {
            return res.status(404).json({ message: 'Matchday not found' });
        }
        res.json(matchday);
    } catch (err) {
        console.error('Error fetching matchday:', err);
        res.status(500).json({ message: err.message });
    }
});

// Aggiorna un matchday di un calendario specifico
router.put('/:matchdayId', verifyToken, checkAdmin, async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const sanitizedParams = sanitize(req.params);
    try {
        const updatedMatchday = await Matchday.findByIdAndUpdate(sanitizedParams.matchdayId, sanitizedBody, { new: true });
        if (!updatedMatchday) return res.status(404).json({ message: 'Matchday not found' });
        res.json(updatedMatchday);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Elimina un matchday di un calendario specifico
router.delete('/:matchdayId', verifyToken, checkAdmin, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
        const deletedMatchday = await Matchday.findByIdAndDelete(sanitizedParams.matchdayId);
        if (!deletedMatchday) return res.status(404).json({ message: 'Matchday not found' });
        res.json({ message: 'Matchday deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Monta le rotte della formazione come sottomodello di un matchday
router.use('/:matchdayId/formation', formationRoutes);

module.exports = router;