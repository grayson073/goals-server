const express = require('express');
const app = express();
// const morgan = require('morgan');
const errorHandler = require('./utils/error-handler');
const ensureAuth = require('./utils/ensure-auth')();

require('./models/register-plugins');
const redirectHttp = require('./utils/redirect-http');
const checkConnection = require('./utils/check-connection');

if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp());
}

if(process.env.NODE_ENV !== 'production') {
    app.use(checkConnection());
}

// app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

const auth = require('./routes/auth');
const goals = require('./routes/goals');
const users = require('./routes/users');

app.use('/api/auth', auth);
app.use('/api/me/goals', ensureAuth, goals);
app.use('/api/users', ensureAuth, users);

// CATCH ALL FOR SINGLE-PAGE APPLICATIONS
app.use((req, res) => {
    res.sendFile('index.html', { root: './public' });
});

// ERROR HANDLER
app.use(errorHandler());

module.exports = app;