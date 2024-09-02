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
        minLength:[8,"password must be 8 character long"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('user', UserSchema);
module.exports = User;