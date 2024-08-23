const express = require('express');
const querystring = require('querystring');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Route to handle verification (now just directly rendering the dashboard)
app.get('/', (req, res) =>{
    res.render('index');
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
