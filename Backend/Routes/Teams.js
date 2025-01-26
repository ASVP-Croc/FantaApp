const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const calendarRoutes = require('./Calendars');
const playersRoutes = require('./Players');
const { verifyToken, checkAdmin } = require('../authMiddleware');
const { body, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');
const crypto = require('crypto');

// creazione squadra
router.post('/', verifyToken, 
  body('name').isString().notEmpty().withMessage('Il nome della squadra è obbligatorio'),
  body('coach').isString().notEmpty().withMessage('Il nome del coach è obbligatorio'),
  async (req, res) => {
    //controllo parametri inseriti dall'utente
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  //elaborazioen richiesta
  const sanitizedBody = sanitize(req.body);
    const { name, coach } = sanitizedBody;
    if (!name || !coach) {
    return res.status(400).json({ message: 'Nome e coach sono obbligatori' });
  }
  try {
    let inviteCode;
    let isUnique = false;

    // Genera un codice univoco
    while (!isUnique) {
      inviteCode = crypto.randomBytes(4).toString('hex');
      const existingTeam = await Team.findOne({ inviteCode });
      if (!existingTeam) isUnique = true;
    }

    // Crea una nuova squadra
    const newTeam = new Team({
      name,
      coach,
      createdBy: req.user.userId,
      inviteCode,
    });

    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ message: 'Errore server: ' + err.message });
  }
});

// Ottenere squadre per l'utente
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const createdTeams = await Team.find({ createdBy: userId });

    // Trova le squadre a cui l'utente si è unito
    const user = await User.findById(userId).populate('teamsJoined.team');

    // Creare un array con squadre complete e punti totali
    const joinedTeams = user.teamsJoined.map(joined => ({
      ...joined.team.toObject(),
      totalPoints: joined.totalPoints,
    }));

    res.status(200).json({ createdTeams, joinedTeams });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero delle squadre', error: error.message });
  }
});

  
// Get a team by ID
router.get('/:teamId', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    const teamId = sanitizedParams.teamId;
    try {
      const team = await Team.findById(teamId)
        .populate('players')
        .populate('calendar');
      if (!team) {
        return res.status(404).json({ message: 'Squadra non trovata' });
      }
      res.json(team);
    } catch (err) {
      console.error('Errore nel backend:', err);
      res.status(500).json({ message: 'Errore interno del server' });
    }
  });

// Modifica una squadra
router.put('/:teamId', verifyToken, checkAdmin,
  body('name').optional().isString(),
  body('coach').optional().isString(),
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
  const { name, coach } = sanitizedBody;
  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Squadra non trovata' });
    }

    // Aggiorna solo i campi presenti nel body
    if (name !== undefined) team.name = name;
    if (coach !== undefined) team.coach = coach;

    await team.save(); // Salva i dati aggiornati
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante la modifica: ' + err.message });
  }
});
  
  // Elimina una squadra
router.delete('/:teamId', verifyToken, checkAdmin, async (req, res) => {
  const sanitizedParams = sanitize(req.params);
  try {
    const teamId = sanitizedParams.teamId;

      // Controlla se l'ID è stato passato
      if (!teamId) {
        return res.status(400).json({ message: 'ID non fornito' });
      }

    // Elimina la squadra
    const team = await Team.findByIdAndDelete(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Squadra non trovata' });
    }

    res.status(200).json({ message: 'Squadra eliminata con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});
  /* Gestione dei sottomodelli */
router.use('/:teamId/calendars', calendarRoutes);
router.use('/:teamId/players', playersRoutes);

module.exports = router;