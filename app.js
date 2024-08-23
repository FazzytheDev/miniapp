const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
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

    // Create the data-check-string
    const dataCheckString = Array.from(data.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    // Generate the secret key
    const secretKey = generateSecretKey(BOT_TOKEN);

    // Generate the hash
    const generatedHash = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    // Compare the generated hash with the received hash
    return generatedHash === receivedHash;
}

// Route to receive the Telegram data and validate it
app.post('/send-telegram-data', (req, res) => {
    const { initData } = req.body;

    if (verifyTelegramData(initData)) {
        const user = JSON.parse(req.body.user);

        // Proceed with your logic, e.g., rendering a dashboard or responding with success
        res.status(200).send('Data verified successfully');
    } else {
        res.status(400).send('Invalid data');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
