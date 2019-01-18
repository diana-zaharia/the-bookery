var app = angular.module('dashboard', []);

app.service('XHRBookListService', function ($http) {
	this.request = function(callback) {
		$http({
			method: 'GET',
			url: '/getBookList'
		}).then(function(res){
		 	if(res.status === 200) {
					callback(true, res);
			} else {
				callback(false);
			}
		}, function(res){
			// console.log('error on getting bookList');
		});
	}
});

app.service('XHRGetUserService', function ($http) {
	this.request = function(callback) {
		$http({
			method: 'GET',
			url: '/getUser'
		}).then(function(res){
		 	if(res.status === 200) {
					callback(true, res);
			} else {
				callback(false);
			}
		}, function(res){
			// console.log('got bookList');
		});
	}
});

app.service('XHRBookRegisterService', function ($http) {
	this.request = function(bookID, callback) {
		$http({
			method: 'POST',
			url: '/saveBookID',
			data: {
				bookID: bookID
			}
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

app.service('BookListService',['XHRBookListService',function(XHRBookListService){
	this.getBookList = function(cb) {
		XHRBookListService.request(function(res, data) {
			if(res === true) {
				cb(data);
			} else {
				// console.log('couldn\'t get books');
			}
		});
	};
}]);

app.service('BookEditService',['XHRBookRegisterService',function(XHRBookRegisterService){
	this.editBook = function(bookID) {
		return XHRBookRegisterService.request(bookID, function(res) {
			if(res === true) {
				window.location = '/edit.html';
			} else {
				// console.log('couldn\'t send bookID');
			}
		});
	};
}]);

app.service('BookProgressService',['XHRBookRegisterService',function(XHRBookRegisterService){
	this.progressBook = function(bookID) {
		return XHRBookRegisterService.request(bookID, function(res) {
			if(res === true) {
			} else {
				// console.log('couldn\'t send bookID for progress');
			}
		});
	};
}]);

app.service('UserService',['XHRGetUserService',function(XHRGetUserService){
	this.getUser = function(cb) {
		return XHRGetUserService.request(function(res, user) {
			if(res === true) {
				cb(user);
			} else {
				// couldn't get user
			}
		});
	};
}]);

app.controller('DashboardController',
	['$scope',
	'BookListService',
	'BookEditService',
	'BookProgressService',
	'UserService',
	function($scope, BookListService, BookEditService, BookProgressService, UserService) {
		$scope.Math = window.Math;
		$scope.sortType = 'title';
		$scope.sortReverse = false;

		function setBookData(data) {
			$scope.bookList = data.data;
		}
		BookListService.getBookList(setBookData);

		function viewUser(user) {
			$scope.currentUser = user.data.firstName;
		}

		UserService.getUser(viewUser);

		$scope.editBook = function(bookID) {
			BookEditService.editBook(bookID);
		};

		$scope.progressBook = function(bookID) {
			BookProgressService.progressBook(bookID);
		};

}]);
