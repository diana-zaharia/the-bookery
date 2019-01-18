var app = angular.module('edit.book', []);

app.service('XHRGetBookService', function ($http) {
	this.request = function(callback) {
		$http({
			method: 'GET',
			url: '/getBook',
		}).then(function(res){
			if(res.status === 200) {
				callback(true, res);
			} else {
				callback(false);
			}
		}, function(res){
			// console.log('error on sending bookId');
		});
	}
});

app.service('GetBookService',['XHRGetBookService',function(XHRGetBookService){
	this.getBook = function(cb) {
			XHRGetBookService.request(function(res, data) {
			if(res === true) {
				cb(data);
			} else {
				// console.log('couldn\'t get books');
			}
		});
	};
}]);

app.service('XHRModifyBookService', function ($http) {
	this.request = function(book, callback) {
		$http({
			method: 'POST',
			url: '/modifyBook',
			data: {
				book: book
			}
		}).then(function(res){
		 	if(res.status === 200) {
				callback(true);
			} else {
				callback(false);
			}
		}, function(res){
				// console.log('error on adding book');
		});
	}
});

app.service('ModifyBookService',['XHRModifyBookService',function(XHRModifyBookService){
	this.modifyBook = function(book) {
		return XHRModifyBookService.request(book, function(res) {
			if(res === true) {
				window.location = '/dashboard.html';
			} else {
				// console.log('couldn\'t add book');
			}
		});
	};
}]);

app.service('XHRDeleteBookService', function ($http) {
	this.request = function(bookID, callback) {
		$http({
			method: 'POST',
			url: '/deleteBook',
			data: {
				bookID: bookID
			}
		}).then(function(res){
			if(res.status === 200) {
					callback(true);
			} else {
				callback(false);
			}
		}, function(res){
				// console.log('error on deleting book');
		});
	}
});

app.service('DeleteBookService',['XHRDeleteBookService',function(XHRDeleteBookService){
	this.deleteBook = function(bookID) {
		return XHRDeleteBookService.request(bookID, function(res) {
			if(res === true) {
				window.location = '/dashboard.html';
			} else {
				// console.log('couldn\'t delete book');
			}
		});
	};
}]);

app.controller('EditBookController', ['$scope', 'GetBookService', 'ModifyBookService', 'DeleteBookService',
	function($scope, GetBookService, ModifyBookService, DeleteBookService) {

	function cb(data) {
		$scope.book = data.data;
	}

	GetBookService.getBook(cb);

	$scope.saveBook = function() {
		if(!$scope.book.title) {
			var el = document.getElementById('title');
			el.classList.add('red-border');
		} else {
			ModifyBookService.modifyBook($scope.book);
		}
	};

	$scope.cancel = function() {
		window.location = './dashboard.html'
	};

	$scope.deleteBook = function() {
		DeleteBookService.deleteBook($scope.book._id);
	};
}]);
