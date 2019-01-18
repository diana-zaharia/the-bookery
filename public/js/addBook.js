var app = angular.module('add.book', []);

app.service('XHRService', function ($http) {
	this.request = function(book, callback) {
		$http({
			method: 'POST',
			url: '/addBook',
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

app.service('AddBookService',['XHRService',function(XHRService){
	this.addBook = function(book) {
		return XHRService.request(book, function(res) {
			if(res === true) {
				window.location = '/dashboard.html';
			} else {
				// console.log('couldn\'t add book');
			}
		});
	};
}]);

app.controller('AddBookController', ['$scope', 'AddBookService', function($scope, AddBookService) {
	$scope.addBook = function() {
		if(!$scope.book.title) {
			var el = document.getElementById('title');
			el.classList.add('red-border');
		} else {
			AddBookService.addBook($scope.book);
		}
	};
	$scope.cancel = function() {
		window.location = '/dashboard.html';
	};
}]);
