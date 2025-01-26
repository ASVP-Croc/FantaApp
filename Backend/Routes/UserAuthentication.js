const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const cookieParser = require('cookie-parser');
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../authMiddleware');
const Team = require('../models/Team');
const { body, validationResult } = require('express-validator');
router.use(cookieParser());
const sanitize = require('mongo-sanitize');

//Endpoint per il login utente
router.post('/login',
    body('email').isString().notEmpty().withMessage('E-mail utente obbligatoria'),
    body('password').isString().notEmpty().withMessage('Password utente obbligatoria'),
    async (req, res) => {
        //controllo parametri inseriti dall'utente
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
//elaborazione richiesta
    const sanitizedBody = sanitize(req.body);
    const { email, password } = sanitizedBody;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            message: 'Login effettuato con successo',
            accessToken
        });
    } catch (error) {
        return res.status(500).json({ message: 'Errore del server', error: error.message });
    }
});

//Endpoint per la registrazione di un nuovo utente
router.post('/register',
    body('firstName').isString().notEmpty().withMessage('Il nome utente è obbligatorio'),
    body('lastName').isString().notEmpty().withMessage('Il cognome utente è obbligatorio'),
    body('email').isString().notEmpty().withMessage('E-mail utente obbligatoria'),
    body('username').isString().notEmpty().withMessage('Username utente obbligatorio'),
    body('password').isString().notEmpty().withMessage('Password utente obbligatoria'),
    async (req, res) => {
        //controllo parametri inseriti dall'utente
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
//elaborazione richesta
    const sanitizedBody = sanitize(req.body);
    const { firstName, lastName, email, username, password } = sanitizedBody;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email o username già in uso' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();
        const payload = {
            userId: newUser._id,
            username: newUser.username,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Errore server: ' + err.message });
    }
});

//Endpoint per ottenere il refresh-token
router.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token mancante' });
    }
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
          );
        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Refresh token non valido', error: error.message });
    }
});

//Endpoint per il logout
router.post('/logout', (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    return res.status(200).json({ message: 'Logout effettuato con successo' });
});

//Endpoint per ottenere i dettagli dell'utente
router.get('/:userId', verifyToken, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
  try {
      const user = await User.findById(sanitizedParams.userId).populate('teamsJoined.team');
      if (!user) {
          return res.status(404).json({ message: 'Utente non trovato' });
      }
      res.json({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          teamsJoined: user.teamsJoined,
      });
  } catch (err) {
      res.status(500).json({ message: 'Errore nel recupero dei dettagli dell\'utente' });
  }
});

  //Endpoint per iscrivere un utente a una squadra tramite il codice di invito
router.post('/:userId/joinTeam', verifyToken,
    body('inviteCode').isString().notEmpty().isLength(8).withMessage('Il codice iscrizione deve essere presente e lungo 8 caratteri'),
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
      const { userId } = sanitizedParams;
      const { inviteCode } = sanitizedBody;
  
      const team = await Team.findOne({ inviteCode });
      if (!team) {
        return res.status(404).json({ message: 'Squadra non trovata con questo codice di invito.' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato.' });
      }
  
      const alreadyJoined = user.teamsJoined.some(joinedTeam => joinedTeam.team.equals(team._id));
      if (alreadyJoined) {
        return res.status(400).json({ message: 'Sei già iscritto a questa squadra.' });
      }
  
      user.teamsJoined.push({ team: team._id, totalPoints: 0 });
      await user.save();
  
      res.status(200).json({ message: 'Iscrizione alla squadra completata con successo!', team });
    } catch (error) {
      res.status(500).json({ message: 'Errore del server.', error });
    }
  });
module.exports = router;