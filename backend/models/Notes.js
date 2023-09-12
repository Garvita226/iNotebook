const mongoose = require('mongoose')

// Create a schema
const NotesSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    tag : {
        type: String,
        default: 'General'
    },
    date : {
        type : Date,
        default: Date.now
    }
})

// Create and export a model
module.exports = mongoose.model('notes', NotesSchema);