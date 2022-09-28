const Note = require('../../models/Note');
const User = require('../../models/User');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

const handleCreate = async (req, res) => {
    let username = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            username = decoded.UserInfo.username;
        }
    );
    
    if (!username) {
        return res.sendStatus(400);
    }

    const foundUser = await User.findOne({ username });
    if (!foundUser) {
        return res.sendStatus(404);
    }

    try {
        const newNote = await Note.create({
            title: "",
            body: "",
            username: username
        });
        return res.status(201).json({ 
            _id: newNote._id,
            title: newNote.title,
            body: newNote.body,
        });
    }
    catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const handleUpdate = async (req, res) => {
    let username = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            username = decoded.UserInfo.username;
        }
    );

    const { id, title, body } = req?.body;

    if (!id || (title === null || title === undefined) || (body === null || body === undefined)) {
        return res.status(400).json({ 'message': 'Id, title, and body are required.'});
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ 'message': 'Invalid object id.' });
    }

    const match = await Note.findById(id);

    if (!match) {
        return res.sendStatus(404);
    }

    if (match.username !== username) {
        return res.sendStatus(400);
    }

    try {
        match.title = title;
        match.body = body;

        await match.save();
        console.log('object');
        return res.sendStatus(204);
    }
    catch (err) {
        return res.status(500).json({ 'message': err });
    }
}

const handleDelete = async (req, res) => {
    let username = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            username = decoded.UserInfo.username;
        }
    );


    const { id } = req?.body;


    if (!id) {
        return res.sendStatus(400);
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ 'message': 'Invalid object id.' });
    }

    const match = await Note.findById(id);

    if (!match) {
        return res.sendStatus(404);
    }

    if (match.username !== username) {
        return res.sendStatus(400);
    }

    try {
        await match.remove();
        res.sendStatus(204);
    }
    catch (err) {
        console.log(req.body);
        return res.status(500).json({ 'message': err });
    }
}

const getUserNotes = async (req, res) => {
    let username = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            username = decoded.UserInfo.username;
        }
    );

    try {
        const notes = await Note.find({ username }).select('_id title body');
        return res.status(200).json(notes);
    }
    catch (err) {
        return res.status(500).json({ 'message': err });
    }
}

module.exports = {
    handleCreate,
    handleUpdate,
    handleDelete,
    getUserNotes
}