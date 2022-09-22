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

connectDB();

const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
});