const express = require('express');
const querystring = require('querystring');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Route to handle verification (now just directly rendering the dashboard)
app.get('/verify', (req, res) => {
    const initData = req.query.init_data;

    if (initData) {
        const user = querystring.parse(initData);
        res.redirect(`/dashboard?telegramId=${user.id}`);
    } else {
        res.status(400).send('Invalid data');
    }
});

// Route to handle dashboard display
app.get('/dashboard', (req, res) => {
    const telegramId = req.query.telegramId;
    if (telegramId) {
        // Render the dashboard with the Telegram ID
        res.render('dashboard', { telegramId: telegramId });
    } else {
        res.status(400).send('Telegram ID is missing');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
