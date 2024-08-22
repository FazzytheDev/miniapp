const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const ejs = require('ejs');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
})
app.post('/auth/telegram', async(req, res) => {
    const user = req.body.user;
    if(user && user.id){
        res.render('dashboard', {
            telegramId: user.id,
            username: user.username,
            referralId: user.referralId,
            balance: 1000
        });
    }
    else{
        res.render('/error', {
            error: 'not found'
        });
    }
});


app.listen(3000, () => {
    console.log('server started at port xoxo');
})