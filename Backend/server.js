const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const teamsRoutes = require('./Routes/Teams');
const usersRoutes = require('./Routes/UserAuthentication');
const usersMatchdays = require('./Routes/UserMatchdays');
const usersRanking = require('./Routes/Ranking');
const helmet = require('helmet');
const { validateObjectId } = require('./checkIdMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());

// Configurazione Helmet per CSP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], // Permetti solo risorse dal proprio dominio
            scriptSrc: ["'self'"], // Blocca script iniettati da fonti esterne
            objectSrc: ["'none'"], // Disabilita plugin come Flash
            imgSrc: ["'self'", "data:"], // Permetti immagini da stesso dominio e inline data URIs
            connectSrc: ["'self'"], // Limita richieste AJAX al proprio dominio
        },
    },
    crossOriginEmbedderPolicy: true, // Protegge da vulnerabilità con risorse incorporate
}));

// Connessione a MongoDB
mongoose.connect('mongodb://localhost:27017/fantaApp')
    .then(() => console.log('Connesso a MongoDB'))
    .catch(err => console.error('Errore di connessione a MongoDB:', err));

// Utilizzo delle rotte
app.use('/api/teams',validateObjectId, teamsRoutes);
app.use('/api/users',validateObjectId, usersRoutes);
app.use('/api/matchdays',validateObjectId, usersMatchdays);
app.use('/api/ranking',validateObjectId, usersRanking);

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});