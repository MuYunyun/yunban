var mongoose = require('mongoose');
var UserSchema = require('../../schemas/user/user');
var User = mongoose.model('User', UserSchema);

module.exports = User;