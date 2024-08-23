const express = require('express');
const bodyParser = require('body-parser');

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

    // Pass data to the dashboard and render it
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

        // Send the dashboard HTML as a string
        res.send(html);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
