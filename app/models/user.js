var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type:String, unique: true},
	password: {type:String},
	firstName: String,
	lastName: String,
	email: String
})
var User = mongoose.model('User', userSchema);

module.exports = User;
