// User.js

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    is_active:  {type: Boolean, default: true}
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');