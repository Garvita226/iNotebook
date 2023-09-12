const mongoose = require('mongoose')

// Create a schema
const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    date : {
        type : Date,
        default: Date.now
    }
})

// Create and export a model
const User = mongoose.model('user', UserSchema);
module.exports = User;