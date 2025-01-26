const express = require('express');
const router = express.Router({ mergeParams: true });
const Player = require('../models/Player');
const Team = require('../models/Team');
const { verifyToken, checkAdmin } = require('../authMiddleware');
const { body, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');

// Crea un nuovo giocatore e aggiungilo alla lista dei giocatori della squadra
router.post('/', verifyToken, checkAdmin,
    body('firstName').isString().notEmpty().withMessage('Il nome del giocatore è obbligatorio'),
    body('lastName').isString().notEmpty().withMessage('Il cognome del giocatore è obbligatorio'),
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
    const player = new Player(sanitizedBody);
    try {
        // Salva il nuovo giocatore nel database
        const newPlayer = await player.save();

        // Trova la squadra e aggiungi l'ID del nuovo giocatore
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        team.players.push(newPlayer._id);
        await team.save();

        res.status(201).json(newPlayer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ottieni tutti i giocatori di una squadra specifica
router.get('/', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    const { teamId } = sanitizedParams;
    try {
        // Trova la squadra e popola la lista di giocatori
        const team = await Team.findById(teamId).populate('players');
        
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.json(team.players);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ottieni un singolo giocatore per ID
router.get('/:playerId', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
        const player = await Player.findById(sanitizedParams.playerId);
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Aggiorna un giocatore
router.put('/:playerId', verifyToken, checkAdmin,
    body('goals').optional().isInt(),
    body('assists').optional().isInt(),
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
        const player = await Player.findById(sanitizedParams.playerId);

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        // Aggiorna il giocatore
        const updatedPlayer = await Player.findByIdAndUpdate(sanitizedParams.playerId, sanitizedBody, { new: true });
        res.json(updatedPlayer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Elimina un giocatore
router.delete('/:playerId', verifyToken, checkAdmin, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
        const deletedPlayer = await Player.findByIdAndDelete(sanitizedParams.playerId);
        if (!deletedPlayer) return res.status(404).json({ message: 'Player not found' });
        res.json({ message: 'Player deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;