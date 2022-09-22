const User = require('../models/User');
const bcrypt = require('bcrypt');
const { nextDay } = require('date-fns');
const { default: mongoose } = require('mongoose');

const handleRegister =  async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ 'message': 'Username and password are required.'});
    }


    const duplicate = await User.findOne({ username }).exec();
    console.log(duplicate);
    if (duplicate) {
        return res.sendStatus(409);
    }


    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username: username,
            password: hashedPassword
        })

        console.log(newUser);

        res.status(201).json({ 'success': `New user ${username} has been created!`});
    }
    catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const handleLogin = async (req, res) => {
    const { username, password } = req?.body;

    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.'});
    }

    const foundUser = await User.findOne({ username });

    if (!foundUser) {
        return res.status(401);
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {

    }
    else {
        return res.status(401);
    }



    console.log(username, password);
}

module.exports = {
    handleRegister,
    handleLogin
}