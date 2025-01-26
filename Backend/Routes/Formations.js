const express = require('express');
const router = express.Router({ mergeParams: true });
const Formation = require('../models/Formation');
const Matchday = require('../models/Matchday');
const User = require('../models/User');
const { verifyToken, checkAdmin } = require('../authMiddleware');
const { body, validationResult } = require('express-validator');
const sanitize = require('mongo-sanitize');

// rotta creazione formazione admin
router.post('/', verifyToken, checkAdmin,
  body('module').isString().isLength({ min: 5 }).notEmpty().withMessage('Il modulo è obbligatorio'),
  async (req, res) => {
    //controllo parametri inseriti dall'utente
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //elaborazione richiesta
    const sanitizedBody = sanitize(req.body);
    const sanitizedParams = sanitize(req.params);
  const { teamId, matchdayId } = sanitizedParams;
  const { players, module, createdBy } = sanitizedBody;

  // Verifica che ci siano esattamente 11 giocatori
  if (!Array.isArray(players) || players.length !== 11) {
    return res.status(400).json({ message: 'Esattamente 11 giocatori devono essere selezionati' });
  }

  try {
    const matchday = await Matchday.findById(matchdayId);
    if (!matchday) {
      return res.status(404).json({ message: 'Matchday not found' });
    }

  const formation = new Formation({
    players,
    module,
    createdBy,
  });

    const newFormation = await formation.save();

    matchday.officialFormation = newFormation._id;
    await matchday.save();

     // Avvia il calcolo dei punteggi
     await calculateUserPoints(teamId, matchdayId);

    // Popola i dettagli dei giocatori
    const populatedFormation = await Formation.findById(newFormation._id).populate('players');

    // Ritorna la formazione con i giocatori completi
    res.status(201).json(populatedFormation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Ottieni una formazione specifica
  router.get('/', async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
      const { matchdayId } = sanitizedParams;
      const matchday = await Matchday.findById(matchdayId).populate({
        path: 'officialFormation',
        populate: { path: 'players' }
      });
  
      if (!matchday) {
        return res.status(404).json({ message: 'Matchday not found' });
      }
  
      const formation = matchday.officialFormation;
      if (!formation) {
        return res.status(404).json({ message: 'Formation not found' });
    }
  
      res.status(200).json(formation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// rotta per eliminazione formazione admin
router.delete('/:formationId', verifyToken, checkAdmin, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
  try {
      const deletedFormation = await Formation.findByIdAndDelete(sanitizedParams.formationId);
      if (!deletedFormation) return res.status(404).json({ message: 'Formation not found' });
      res.json({ message: 'Formation deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Funzione per calcolare i punteggi degli utenti
async function calculateUserPoints(teamId, matchdayId) {
  try {
      // Recupera il matchday e popola le formazioni e la formazione ufficiale
      const matchday = await Matchday.findById(matchdayId)
          .populate({
              path: 'officialFormation',
              populate: { path: 'players' }
          })
          .populate({
              path: 'formations',
              populate: { path: 'players', path: 'createdBy' }
          });

      if (!matchday || !matchday.officialFormation) {
          throw new Error('Matchday o formazione ufficiale non trovati');
      }

      const officialFormation = matchday.officialFormation;

      // Itera su tutte le formazioni degli utenti
      for (const userFormation of matchday.formations) {
          let points = 0;

          // Controlla se il modulo corrisponde
          if (officialFormation.module === userFormation.module) {
              points += 1;
          }

          // Controlla i giocatori corrispondenti
          const officialPlayers = new Set(officialFormation.players.map(player => player._id.toString()));
          const userPlayers = userFormation.players.map(player => player._id.toString());

          for (const playerId of userPlayers) {
              if (officialPlayers.has(playerId)) {
                  points += 1;
              }
          }

          // Trova l'utente e aggiorna il punteggio
          const user = await User.findById(userFormation.createdBy);
          if (!user) {
              throw new Error(`Utente con ID ${userFormation.createdBy} non trovato`);
          }

          // Aggiorna il punteggio nel team dell'utente
          const teamEntry = user.teamsJoined.find(entry => entry.team.equals(teamId));
          if (teamEntry) {
              teamEntry.totalPoints += points;
          }

          await user.save();
      }
  } catch (error) {
      console.error('Errore durante il calcolo dei punteggi:', error.message);
  }
}
module.exports = router;