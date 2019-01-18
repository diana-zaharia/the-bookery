var app = angular.module('progress.book', []);

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
				// console.log('couldn\'t get book');
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
				book: book,
				progress: true
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

app.service('ModifyProgressService',['XHRModifyBookService',function(XHRModifyBookService){
	this.progressBook = function(book) {
		return XHRModifyBookService.request(book, function(res) {
			if(res === true) {
				window.location = '/dashboard.html';
			} else {
				// console.log('couldn\'t add book');
			}
		});
	};
}]);

app.controller('ProgressBookController', ['$scope', 'GetBookService', 'ModifyProgressService',
	function($scope, GetBookService, ModifyProgressService) {

	$scope.data = {
		availableOptions: [
			{id: '0', name: 'N/A'},
			{id: '1', name: '1'},
			{id: '2', name: '2'},
			{id: '3', name: '3'},
			{id: '4', name: '4'},
			{id: '5', name: '5'}
		],
		selectedOption: {id: '0'} //This sets the default value of the select in the ui
	};

	function cb(data) {
		$scope.book = data.data;
		$scope.data.selectedOption.id = data.data.rating;
	}
	GetBookService.getBook(cb);

	$scope.saveProgress = function() {
		var el = document.getElementById('progress');

		if($scope.book.progress >= 0) {
			el.classList.remove('red-border');
			$scope.book.rating = $scope.data.selectedOption.id;
			ModifyProgressService.progressBook($scope.book);
		} else {
			el.classList.add( 'red-border');
		}
	};

	$scope.cancel = function() {
		window.location = './dashboard.html'
	};
}]);
