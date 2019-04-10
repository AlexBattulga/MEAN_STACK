const m = require('mongoose');
m.connect('mongodb://localhost/login_registration_modularized', { useNewUrlParser: true });
m.connection.on('connected', () => console.log('connected to mongodb'));

module.exports = require('mongoose');