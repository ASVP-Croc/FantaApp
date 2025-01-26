 const User = require('../models/User');
 const express = require('express');
 const router = express.Router();
 const { verifyToken, checkFormationOwner} = require('../authMiddleware');
 const Matchday = require('../models/Matchday');
 const Formation = require('../models/Formation');
 const { body, validationResult } = require('express-validator');
 const sanitize = require('mongo-sanitize');

 //Rotta per ottenere i matchdays della settimana delle squadre a cui un utente è iscritto
router.get('/:userId', verifyToken, async (req, res) => {
  const sanitizedParams = sanitize(req.params);
  try {
    const userId = sanitizedParams.userId;
    const user = await User.findById(userId).populate({
      path: 'teamsJoined.team',
      populate: {
        path: 'calendar',
        populate: {
          path: 'matchdays',
          populate: [
            { path: 'officialFormation' },
            { path: 'formations' }
          ]
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const currentWeekMatchdays = [];
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() + 6));

    user.teamsJoined.forEach(({ team }) => {
      team.calendar.forEach(calendar => {
        calendar.matchdays.forEach(matchday => {
          if (new Date(matchday.date) >= startOfWeek && new Date(matchday.date) <= endOfWeek) {
            currentWeekMatchdays.push({
              teamId: team._id,
              teamName: team.name,
              matchday
            });
          }
        });
      });
    });

    res.json(currentWeekMatchdays);
  } catch (error) {
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

//Rotta per ottenere i dettagli di un matchday specfico
router.get('/:teamId/:matchdayId', verifyToken, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
      const matchday = await Matchday.findById(sanitizedParams.matchdayId).populate('officialFormation')
      .populate('formations');
      if (!matchday) {
        return res.status(404).json({ message: 'Matchday non trovato' });
      }
      res.json(matchday);
    } catch (error) {
      res.status(500).json({ message: 'Errore del server', error: error.message });
    }
  });

  // Rotta per ottenere la formazione creata dall'utente
  router.get('/:teamId/:matchdayId/formations', verifyToken, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
        const { matchdayId } = sanitizedParams;
        // Trova il matchday specifico
        const matchday = await Matchday.findById(matchdayId).populate({
            path: 'formations',
            populate: { path: 'players' },
        });

        if (!matchday) {
            return res.status(404).json({ message: 'Matchday non trovato' });
        }
        // Filtra la formazione creata dall'utente corrente
        const userFormation = matchday.formations.find(
            (formation) => formation.createdBy.toString() === req.user.userId
        );

        if (!userFormation) {
            return res.status(404).json({
                message: 'Nessuna formazione trovata per l\'utente corrente in questo matchday',
            });
        }

        res.status(200).json({ message: 'Formazione trovata', userFormation });
    } catch (error) {
        console.error('Errore durante il recupero della formazione:', error.message);
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
});

// Rotta per creare una formazione utente
router.post('/:matchdayId/formations', verifyToken,
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
    const { matchdayId } = sanitizedParams;
    const { players, module, createdBy } = sanitizedBody;
    if (!Array.isArray(players) || players.length !== 11) {
        return res.status(400).json({ message: 'Esattamente 11 giocatori devono essere selezionati' });
      }

    try {
        // Verifica che il matchday esista
        const matchday = await Matchday.findById(matchdayId);
        if (!matchday) {
            return res.status(404).json({ message: 'Matchday non trovato' });
        }

       // Verifica che la data attuale sia precedente a mezzanotte del giorno del matchday
       const currentDate = new Date();
       const deadline = new Date(matchday.date);
       deadline.setHours(0, 0, 0, 0); // Imposta la scadenza a mezzanotte del giorno del matchday

       if (currentDate >= deadline) {
           return res.status(400).json({ message: 'Non puoi creare una formazione dopo mezzanotte del giorno del matchday' });
       }

        // Verifica che l'utente non abbia già una formazione per questo matchday
        const existingFormation = matchday.formations.find(formation => 
            formation.createdBy === req.user.userId
        );
        if (existingFormation) {
            return res.status(400).json({ message: 'Hai già creato una formazione per questo matchday' });
        }

        // Crea una nuova formazione
        const formation = new Formation({
            players,
            module,
            createdBy,
        });

        // Salva la formazione nel database
        await formation.save();

        // Aggiungi l'ID della formazione al campo `formations` del matchday
        matchday.formations.push(formation._id);
        await matchday.save();

        res.status(201).json({ message: 'Formazione creata con successo', formation });
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
});
  
  // Rotta per eliminare una formazione utente
router.delete('/:matchdayId/formations/:formationId', verifyToken, checkFormationOwner, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
  const { matchdayId, formationId } = sanitizedParams;
  try {
      // Recupera il matchday dal database
      const matchday = await Matchday.findById(matchdayId);
      if (!matchday) {
          return res.status(404).json({ message: 'Matchday non trovato' });
      }

      // Verifica che la data attuale sia precedente a mezzanotte del giorno del matchday
      const currentDate = new Date();
      const deadline = new Date(matchday.date);
      deadline.setHours(0, 0, 0, 0);

      if (currentDate >= deadline) {
          return res.status(400).json({ message: 'Non puoi eliminare una formazione dopo mezzanotte del giorno del matchday' });
      }

      // Elimina la formazione
      const deletedFormation = await Formation.findByIdAndDelete(formationId);
      if (!deletedFormation) {
          return res.status(404).json({ message: 'Formazione non trovata' });
      }

      res.json({ message: 'Formazione eliminata con successo' });
  } catch (err) {
      res.status(500).json({ message: 'Errore del server', error: err.message });
  }
});
module.exports = router;