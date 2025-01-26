const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../authMiddleware');
const sanitize = require('mongo-sanitize');

router.get('/:teamId', verifyToken, async (req, res) => {
    const sanitizedParams = sanitize(req.params);
    try {
        const teamId = sanitizedParams.teamId;
        const users = await User.find({ 'teamsJoined.team': teamId }, { username: 1, teamsJoined: 1 })
            .populate({
                path: 'teamsJoined.team',
                match: { _id: teamId },
            });
        if (!users.length) {
            return res.status(404).json({ message: 'Nessun utente trovato per questa squadra' });
        }

        const leaderboard = users.map(user => {
            const teamData = user.teamsJoined.find(t => t.team && t.team._id.toString() === teamId);
            return {
                username: user.username,
                totalPoints: teamData?.totalPoints || 0,
            };
        }).sort((a, b) => b.totalPoints - a.totalPoints);
        res.json(leaderboard);
    } catch (error) {
        console.error('Errore del server:', error.message);
        res.status(500).json({ message: 'Errore del server', error: error.message });
    }
});

module.exports = router;