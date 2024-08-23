const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
const BOT_TOKEN = '7201865706:AAFL1-MLtGqpvqDsnO2GoaIqB_qcpTwsd0I'; // Replace with your actual bot token

// Function to verify Telegram data
function verifyTelegramData(initData) {
    const data = querystring.parse(initData);
    const checkString = Object.keys(data)
        .filter(key => key !== 'hash')
        .map(key => `${key}=${data[key]}`)
        .sort()
        .join('\n');

    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const hash = crypto.createHmac('sha256', secret)
        .update(checkString)
        .digest('hex');

    return hash === data.hash;
}

// Route to handle verification
app.get('/verify', (req, res) => {
    const initData = req.query.init_data;
    if (verifyTelegramData(initData)) {
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
        // Fetch and render user data
        res.render('dashboard', { telegramId: telegramId });
    } else {
        res.status(400).send('Telegram ID is missing');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
