const e = require('express');
const path = require('path');
const body_parser = require('body-parser');
const flash = require('express-flash');
const m = require('mongoose');

const session = require('express-session');

// setting up the port configuration
const { POST: port = 8000 } = process.env;
const { SCHEMA } = m;
const app = e();

//Trust first proxy
app.set('trust proxy', 1);
app.use(flash());
app.use(session({
    secret: 'VerySecretThing',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

m.connect('mongodb://localhost/Dojo_Secrets', { useNewUrlParser: true });
m.connection.on('connected', () => console.log('connected to mongodb'));

app.use(body_parser.urlencoded({ extended: true }));
app.use(e.static(path.join(__dirname, 'static')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const route = require('./routes/index.js')(app, m);

//Port configuration
app.listen(port, () => console.log(`express server listening on port ${port}`));