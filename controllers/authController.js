const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nextDay } = require('date-fns');
const { default: mongoose } = require('mongoose');

const handleRegister = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required.' });
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
            password: hashedPassword,
        });

        console.log(newUser);

        res.status(201).json({ success: `New user ${username} has been created!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const handleLogin = async (req, res) => {
    const { username, password } = req?.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const foundUser = await User.findOne({ username });

    if (!foundUser) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '50m',
            }
        );

        const refreshToken = jwt.sign(
            {
                username: foundUser.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d',
            }
        );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken });
    } else {
        return res.sendStatus(401);
    }

    console.log(username, password);
};


const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';

    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
};

module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
};
