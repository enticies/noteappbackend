const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        default: ""
    },
    body: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Note', noteSchema);