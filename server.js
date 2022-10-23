require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { logger } = require('./middleware/logEvents');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConn');
const credentials = require('./config/credentials');
const verifyJWT = require('./middleware/verifyJWT.js');
const cookieParser = require('cookie-parser');

connectDB();

const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(credentials);
app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/createnote', require('./routes/createNote'));
app.use('/updatenote', require('./routes/updateNote'));
app.use('/deletenote', require('./routes/deleteNote'));
app.use('/getusernotes', require('./routes/getUserNotes'));

app.all('*', (req, res) => {
    res.sendStatus(404);
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
});