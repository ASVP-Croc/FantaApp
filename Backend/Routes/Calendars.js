const express = require('express');
const router = express.Router({ mergeParams: true });
const Calendar = require('../models/Calendar');
const matchdaysRoutes = require('./Matchdays');
const Team = require('../models/Team');
const Matchday = require('../models/Matchday');
const { verifyToken, checkAdmin } = require('../authMiddleware');
const { body, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');

// Crea un nuovo calendario e associarlo alla squadra
router.post('/', verifyToken, checkAdmin,
    body('season').isString().notEmpty().withMessage('La stagione è obbligatoria!'),
    async (req, res) => {
        //controllo parametri inseriti dall'utente
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //elaborazione richiesta
    const sanitizedBody = sanitize(req.body);
    const sanitizedParams = sanitize(req.params);
    const { teamId } = sanitizedParams;
    const { season, numMatchdays } = sanitizedBody;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const calendar = new Calendar({ season });
        const newCalendar = await calendar.save();

        const matchdays = [];
        for (let i = 1; i <= numMatchdays; i++) {
            const matchday = new Matchday({
                number: i,
                date: new Date()
            });
            const newMatchday = await matchday.save();
            matchdays.push(newMatchday._id);
        }

        newCalendar.matchdays = matchdays;
        await newCalendar.save();

        team.calendar.push(newCalendar._id);
        await team.save();

        res.status(201).json(newCalendar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ottieni tutti i calendari di una squadra
router.get('/', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    const { teamId } = sanitizedParams;
    try {
        const team = await Team.findById(teamId).populate('calendar');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Restituisci tutti i calendari associati alla squadra
        res.json(team.calendar);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ottieni un calendario specifico di una squadra
router.get('/:calendarId', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    const { teamId, calendarId } = sanitizedParams;
    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Trova il calendario specifico
        const calendar = await Calendar.findById(calendarId).populate('matchdays');
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }

        res.json(calendar);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Aggiorna un calendario di un team specifico
router.put('/:calendarId', verifyToken, checkAdmin,
    body('season').optional().isString(),
    async (req, res) => {
        //controllo parametri inseriti dall'utente
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //elaborazione richiesta
    const sanitizedBody = sanitize(req.body);
    const sanitizedParams = sanitize(req.params);
    try {
        const updatedCalendar = await Calendar.findByIdAndUpdate(sanitizedParams.calendarId, sanitizedBody, { new: true });
        if (!updatedCalendar) return res.status(404).json({ message: 'Calendar not found' });
        res.json(updatedCalendar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Elimina un calendario di un team specifico
router.delete('/:calendarId', verifyToken, checkAdmin, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
        const deletedCalendar = await Calendar.findByIdAndDelete(sanitizedParams.calendarId);
        if (!deletedCalendar) return res.status(404).json({ message: 'Calendar not found' });
        res.json({ message: 'Calendar deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Monta le rotte dei matchdays come sottomodelli di un calendario
router.use('/:calendarId/matchdays', matchdaysRoutes);

module.exports = router;