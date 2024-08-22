const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');
const app = express();

const BOT_TOKEN = '7201865706:AAFL1-MLtGqpvqDsnO2GoaIqB_qcpTwsd0I'; // Replace with your bot token

function verifyTelegramData(initData) {
    const data = querystring.parse(initData);
    const hash = crypto.createHash('sha256').update(initData + BOT_TOKEN).digest('hex');
    return data.auth_date && data.hash === hash;
}

app.get('/verify', (req, res) => {
    const initData = req.query.init_data;
    if (verifyTelegramData(initData)) {
        // Extract user information from initData
        const user = querystring.parse(initData);
        // Save user data or process it as needed
        res.redirect(`/dashboard?telegramId=${user.id}`);
    } else {
        res.status(400).send('Invalid data');
    }
});

app.get('/dashboard', (req, res) => {
    const telegramId = req.query.telegramId;
    // Render the dashboard with user data
    res.render('dashboard', { telegramId });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
