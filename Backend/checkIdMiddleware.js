// Middleware per validazione degli ID
const validateObjectId = (req, res, next) => {
    const { userId, matchdayId, teamId, formationId } = req.params;
    if (
        (userId && !mongoose.Types.ObjectId.isValid(userId)) ||
        (matchdayId && !mongoose.Types.ObjectId.isValid(matchdayId)) ||
        (teamId && !mongoose.Types.ObjectId.isValid(teamId)) ||
        (formationId && !mongoose.Types.ObjectId.isValid(formationId))
    ) {
        return res.status(400).json({ message: 'ID non valido' });
    }
    next();
};
module.exports = { validateObjectId }