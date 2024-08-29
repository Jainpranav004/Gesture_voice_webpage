const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique:true,
        minLength:{
            value: 8,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;