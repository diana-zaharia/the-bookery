var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
	title: String,
	author: String,
	edition: String,
	pages: Number,
	rating: Number,
	progress: Number,
	dateAdded: {type:Date, default: Date.now},
	dateModified: Date,
	addedBy: String,
	review: String
})
var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
