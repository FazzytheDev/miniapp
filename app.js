const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const app = express();
app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

const BOT_TOKEN = '7201865706:AAFL1-MLtGqpvqDsnO2GoaIqB_qcpTwsd0I'; // Replace with your actual bot token

// Function to generate the secret key
function generateSecretKey(botToken) {
    return crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
}

// Function to verify Telegram data
function verifyTelegramData(initData) {
    const data = new URLSearchParams(initData);
    const receivedHash = data.get('hash');
    data.delete('hash');

    // Create the data-check-string by sorting keys and joining key-value pairs
    const dataCheckString = Array.from(data.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    // Generate the secret key using HMAC-SHA-256 with the bot token and 'WebAppData' as the key
    const secretKey = generateSecretKey(BOT_TOKEN);

    // Generate the hash using the secret key and the data-check-string
    const generatedHash = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Compare the generated hash with the received hash
    return generatedHash === receivedHash;
}

// Route to render the index page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to receive the Telegram data and validate it
app.post('/send-telegram-data', (req, res) => {
    const { initData } = req.body;

    if (verifyTelegramData(initData)) {
        const user = JSON.parse(req.body.user);

        // Redirect to the dashboard with user data as query parameters
        res.redirect(`/dashboard?telegramId=${user.id}&firstName=${user.first_name}&lastName=${user.last_name || 'N/A'}&username=${user.username || 'N/A'}&languageCode=${user.language_code || 'N/A'}`);
    } else {
        res.status(400).send('Invalid data');
    }
});

// Route to render the dashboard with the passed query parameters
app.get('/dashboard', (req, res) => {
    const { telegramId, firstName, lastName, username, languageCode } = req.query;
    res.render('dashboard', {
        telegramId: telegramId,
        firstName: firstName,
        lastName: lastName,
        username: username,
        languageCode: languageCode
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
