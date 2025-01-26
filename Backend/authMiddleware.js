require('dotenv').config();
const jwt = require('jsonwebtoken');
const Team = require('./models/Team');
const Formation = require('./models/Formation')

const secretKey = process.env.JWT_SECRET;

// Middleware di verifica del token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Accesso negato, token mancante' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user= decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token non valido' });
    }
};

// Middleware per verificare che l'utente sia admin di un team
const checkAdmin = async (req, res, next) => {
    const { teamId } = req.params;
    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team non trovato' });
        }
        if (team.createdBy.toString() !== req.user.userId) { 
            return res.status(403).json({ message: 'Non autorizzato' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
};

// Verifica che l'utente sia il creatore della formazione
const checkFormationOwner = async (req, res, next) => {
    try {
      const formation = await Formation.findById(req.params.formationId);
      if (!formation) {
        return res.status(404).json({ message: 'Formation not found' });
      }
  
      // Confronta l'utente attuale con `createdBy`
      if (formation.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Access forbidden: You do not own this formation' });
      }
  
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
module.exports = { verifyToken, checkAdmin, checkFormationOwner };