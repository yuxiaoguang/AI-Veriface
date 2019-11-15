var https = require('https')
const express = require('express');
var fs = require('fs');
const path = require('path');
const app = express();
const compression = require('compression');

const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'middleware/public')));

app.use(favicon(path.join(__dirname, 'middleware/public/favicon.ico')));
app.set('views', path.join(__dirname, 'middleware/views'));
app.set('view engine', 'ejs');

const home = require('./middleware/routes/home');

app.use('/', home);

app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

app.listen(3302, () => {
    console.log('listening at http://%s','localhost:3302');
});
