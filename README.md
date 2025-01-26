<h1> FANTAAPP - Applicazione Ibrida </h1>

Alla base del progetto, vengono utilizzati vari framework e librerie di JavaScript:

- Framework Ionic per la parte frontend con utilizzo di:
  -Framework Angular
  -Componenti standalone
  -Tabs per la navigazione
- Node.js e libreria Express.js:
  - mongoose per la comunicazione con MongoDB
  - b-crypt/crypto-js per la cryptazione delle password nel DB
  - JsonWebToken / expressJWT per la gestione dei Token di autenticazione
  - express-validator per la validazione di input utente
  - helmet per la sicurezza contro attacchi XSS
  - dotEnv per la creazione di un environment
  - nodemon per la creazione di un socket autoaggiornante

<h2>Caratteristiche</h2>

- L'applicazione si basa su creazione, autenticazione e autorizzazione dell'utente che potrà svolgere varie attività:

- l'utente(admin) avrà la possibilità di creare una o più squadre e diventare l'admin per le squadre create andando a gestire i giocatori, il calendario, le giornate e la relativa formazione ufficiale dalla creazione alla modifica e eliminazione.

- l'utente(iscritto) avrà la possibilità di iscriversi tramite un codice di invito a una o più squadre e visualizzre i dettagli di ogni squadra come i giocatori, i calendari, le giornate e le formazioni ufficiali. Oltre a questo avrà la capacità di creare una propria formazione per le le squadre a cui si è iscirtto che scendono in campo durante la settimana andando a competere con gli altri utenti iscritti per la vittoria del campionato visibile giornata dopo giornata tramite la classifica.

-Il calcolo dei punti è assegnato nel seguente modo:
 - 1 punto per il modulo uguale a quello presente nella formazione ufficiale.
 - 1 punto per ogni giocatore uguale a quello presente nella formazione ufficiale.
  
- Il tutto utilizzando il paradigma RESTful.

<h2>Installabilità</h2>

- L'applicazione ha la possibilità di essere installata su di un dispositivo mobile come android o IOS . Ovviamente, non essendo attualmente in un ambiente diverso dal localhost, tale servizio è installabile solamente sul dispositivo su cui viene avviato il server http.

<h2>Sicurezza</h2>

- Autenticazione ed autorizzazione avvengono mediante l'uso di un token, generato al rispettivo login/registrazione dell'utente,
  trasmesso nelle richieste HTTP ed inserito nel relativo header, grazie al quale il server sarà in grado di riconoscere l'utente ad ogni 
  richiesta inviata.

-Per garantire maggiore sicurezza è stato configurato un proxy che si occupa di gestire le richieste tra frontend e backend per evitare problemi dovuti all'utilizzo di CORS.

- Grazie all'uso di bcrypt, le password vengono salvate nel DB in maniera cryptata

- Attacchi NoSQL injection vengono evitati grazie alla validazione e sanitizzazione degli input e alle query parametrizzate

- Attacchi XSS vengono evitati con l'utilizzo della libreria 'helmet' disponibile per Node.js

