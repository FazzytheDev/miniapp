const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
app.use(bodyParser.json());

// Set view engine to EJS
app.set('view engine', 'ejs');

// Route to serve the initial EJS file
app.get('/', (req, res) => {
    res.render('index');
});

// Route to receive the Telegram data and render it on the dashboard
app.post('/send-telegram-data', (req, res) => {
    const { user } = req.body;

    // Render the dashboard with the received data
    res.render('dashboard', { 
        telegramId: user.id,
        firstName: user.first_name,
        lastName: user.last_name || 'N/A',
        username: user.username || 'N/A',
        languageCode: user.language_code || 'N/A'
    }, (err, html) => {
        if (err) {
            return res.status(500).send('Error rendering dashboard.');
        }

        // Respond with the URL of the dashboard, using a temp view route
        res.json({ redirectUrl: `/dashboard?telegramId=${user.id}&firstName=${user.first_name}&lastName=${user.last_name || ''}&username=${user.username || ''}&languageCode=${user.language_code || ''}` });
    });
});

// Route to serve the dashboard with data passed as query parameters
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { 
        telegramId: req.query.telegramId,
        firstName: req.query.firstName,
        lastName: req.query.lastName || 'N/A',
        username: req.query.username || 'N/A',
        languageCode: req.query.languageCode || 'N/A'
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
