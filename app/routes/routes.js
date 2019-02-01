var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var User = require('../models/User')
var Book = require('../models/Book')
var config = require('../config');

mongoose.connect(config.database); // connect to database

//####### ROUTES ########## //
router.get('/', function(req, res, next) {
	res.redirect('/dashboard.html');
});

router.get('/edit.html', function(req,res){
	if(!req.session.user) {
		console.log('user not logged in');
		return res.status(299).redirect('/login.html');
	}
	return res.status(200).sendFile('edit.html', {root: appRoot });
});

router.get('/login.html', function(req,res){
	return res.status(200).sendFile('login.html', {root: appRoot });
});

router.get('/logout', function(req,res) {
	req.session.destroy();
	return res.status(200).redirect('/login.html');
});

router.get('/register.html', function(req,res){
	return res.status(200).sendFile('register.html', {root: appRoot });
});

router.get('/registerSuccess.html', function(req,res){
			return res.status(200).sendFile('registerSuccess.html', {root: appRoot });
});

router.get('/dashboard.html', function(req, res) {
	if(!req.session.user) {
		console.log('user not logged in');
		return res.status(299).redirect('/login.html');
	}
	return res.status(200).sendFile('dashboard.html', {root: appRoot });
});

router.get('/progress.html', function(req, res) {
	if(!req.session.user) {
		console.log('user not logged in');
		return res.status(299).redirect('/login.html');
	}
	return res.status(200).sendFile('./progress.html', {root: appRoot });
});

router.get('/addBook.html', function(req,res){
	if(!req.session.user) {
		console.log('user not logged in');
		return res.status(299).redirect('/login.html');
	}
	return res.status(200).sendFile('addBook.html', {root: appRoot });
});

router.post('/signin', function(req,res) {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({username:username, password: password}, function(err,user) {
		if(err) {
			console.log(err);
			return res.status(500).send('error:', err);
		}
		if(!user) {
			console.log('wrong credentials');
			return res.status(222).send();
			// return res.status(401).redirect('/login.html');
		}
		console.log('user:', user);
		req.session.user = user;
		res.status(200).send();
		// return res.redirect('/dashboard.html')
	});
});

router.get('/getBookList', function(req, res) {
	var bookList = {};
	var user = undefined;
	if(req.session.user) {
		user = req.session.user.username;
	}
	if(user) {
		Book.find({addedBy: user}, function(err, books){
			bookList = JSON.stringify(books);
			console.log('bookList:', bookList);
			// console.log('####\n\n PARSED:', JSON.parse(bookList));
			res.status(200).send(bookList);
		});
	} else {
		res.status(488).send();
	}
});

// path not protected by auth
// TODO: check user uniqueness
router.post('/signup', function(req, res) {
	console.log('req.body', req.body);
	var username = req.body.user.username;
	var password = req.body.user.password;
	var firstname = req.body.user.firstName;
	var lastname = req.body.user.lastName;
	var email = req.body.user.email;
	if ( !(username && password && firstname && lastname && email)) {
		return res.status(266).send();
	}
	var newuser = new User();
	newuser.username = username;
	newuser.password = password;
	newuser.firstName = firstname;
	newuser.lastName = lastname;
	newuser.email = email;

	newuser.save(function(err, savedUser) {
		if(err) {
			console.log(err);
			return res.status(288).send();
		}
		return res.status(200).send();
	});
});

// path not protected by auth
router.post('/addBook', function(req, res) {
	var title = req.body.book.title;
	var author = req.body.book.author;
	var edition = req.body.book.edition;
	var pages = req.body.book.pages;
	var rating = 0;
	var progress = 0;
	var dateAdded = new Date();
	var dateModified = new Date();
	var addedBy = req.session.user.username;

	var newBook = new Book();
	newBook.title = title;
	newBook.author = author;
	newBook.edition = edition;
	newBook.pages = pages;
	newBook.rating = rating;
	newBook.progress = progress;
	newBook.dateAdded = dateAdded;
	newBook.dateModified = dateModified;
	newBook.addedBy = addedBy;

	console.log('newBook', newBook);
	newBook.save(function(err, savedBook) {
		if(err) {
			console.log(err);
			return res.status(500).send();
		}
		return res.status(200).send();
	});
});

// save the book that the user clicked on into a global node array
// used for edit book and progress pages
router.post('/saveBookID', function(req, res) {
	var user = req.session.user.username;
	var bookID = req.body.bookID;
	var lastEditBook = { lastEditBook: bookID};

	//store the book that user clicked on so when the edit page loads it will look for this
	locals.users = 	locals.users || {};
	locals.users[user] = lastEditBook;
		res.status(200).send();
});

router.get('/getBook', function(req, res) {
	var user = undefined;
	if(req.session.user) {
		user = req.session.user.username;
	}
	if(user) {
		var bookID = locals.users[user].lastEditBook;
		Book.findOne({_id : bookID}, function(err, book){
			book = JSON.stringify(book);
			console.log('bookWanted:', book);
			res.status(200).send(book);
		});
	} else {
		res.status(488).send();
	}
});

router.get('/getUser', function(req, res) {
	var user = undefined;
	if(req.session.user) {
		// console.log('USERRR:', req.session.user);
		user = JSON.stringify(req.session.user);
		res.status(200).send(user);
	} else {
		res.status(299).send();
	}
});

// path not protected by auth
router.post('/modifyBook', function(req, res) {

	var fieldsObj = {}
	var bookID = req.body.book._id;

	if (req.body.progress) {
		console.log('Modify the progress only');
		fieldsObj = {
			rating : req.body.book.rating,
			pages : req.body.book.pages,
			progress : req.body.book.progress,
			review: req.body.book.review,
			dateModified: new Date()
		};
		res.status(200).send();
	} else {
		fieldsObj = {
			title : req.body.book.title,
			author : req.body.book.author,
			edition : req.body.book.edition,
			pages: req.body.book.pages
		};
	}

	Book.findOneAndUpdate({_id: bookID}, fieldsObj, function(err){
			if(err) {
				console.log('Mongoose:', err);
				res.status(266).send();
			}
			res.status(200).send();
		});
});

router.post('/deleteBook', function(req, res) {
	var bookID = req.body.bookID;

	console.log('Remove the book with id:', bookID);
	Book.findOneAndRemove({_id: bookID}, function(err){
			if(err) {
				console.log('Mongoose:', err);
				res.status(266).send();
			}
			res.status(200).send();
		});
});

module.exports = router;
