const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const crypto = require('crypto');
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});
const BOT_TOKEN = '7201865706:AAFL1-MLtGqpvqDsnO2GoaIqB_qcpTwsd0I';
function generateSecretKey(botToken) {
    return crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
}

function verifyTelegramData(initData) {
    const data = new URLSearchParams(initData);
    const hash = data.get('hash');
    data.delete('hash');

    const dataCheckString = Array.from(data.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secretKey = generateSecretKey(BOT_TOKEN);
    const generatedHash = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    return generatedHash === hash;
}
app.post('/send-telegram-data', (req, res) => {
    const { initData, user } = req.body;
    if(verifyTelegramData(initData)){
    const user = JSON.parse(user);
    res.render('dashboard', { 
        telegramId: user.id,
        firstName: user.first_name,
        lastName: user.last_name || 'N/A',
        username: user.username || 'N/A',
        languageCode: user.language_code || 'N/A'
    }, (err) => {
        if (err) {
            return res.status(500).send('Error rendering dashboard.');
        }
         res.json({ redirectUrl: `/dashboard?telegramId=${user.id}&firstName=${user.first_name}&lastName=${user.last_name || ''}&username=${user.username || ''}&languageCode=${user.language_code || ''}` });
    });
    }
else{
    res.status(400).send('Invalid Data');
}
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
