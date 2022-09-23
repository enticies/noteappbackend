const Note = require('../../models/Note');
const { default: mongoose } = require('mongoose');

const handleCreate = async (req, res) => {
    try {
        await Note.create({
            title: "",
            body: ""
        });
        res.sendStatus(201);
    }
    catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const handleUpdate = async (req, res) => {
    const { id, title, body } = req?.body;

    if (!id || !title || !body) {
        return res.sendStatus(400);
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ 'message': 'Invalid object id.' });
    }

    const match = await Note.findById(id);

    if (!match) {
        return res.sendStatus(404);
    }

    try {
        match.title = title;
        match.body = body;

        await match.save();
        return res.sendStatus(204);
    }
    catch (err) {
        return res.status(500).json({ 'message': err });
    }
}

const handleDelete = async (req, res) => {
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

    try {
        await match.remove();
        res.sendStatus(204);
    }
    catch (err) {
        return res.status(500).json({ 'message': err });
    }
}

module.exports = {
    handleCreate,
    handleUpdate,
    handleDelete
}