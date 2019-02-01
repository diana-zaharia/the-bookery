var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String},
    firstName: String,
    lastName: String,
    email: String
})
var User = mongoose.model('User', userSchema);

userSchema.pre('save', function (next) {
    var self = this;
    User.find({name: self.name}, function (err, docs) {
        if (!docs.length) {
            next();
        } else {
            console.log('user exists: ', self.name);
            next(new Error("User exists!"));
        }
    });
});

module.exports = User;
