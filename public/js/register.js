var app = angular.module('register', []);

app.service('XHRService', function ($http) {
	this.request = function(user, callback) {
		$http({
			method: 'POST',
			url: '/signup',
			data: {
				user: user
			}
		}).then(function(res){
		 	if(res.status === 200) {
					callback(true);
			} else {
				callback(false);
			}
		}, function(res){
			// console.log('error on registering user');
		});
	}
});

app.service('RegisterService',['XHRService', function(XHRService){
	this.register = function(user, cb) {
		XHRService.request(user, function(res) {
			if(res === true) {
				window.location = '/registerSuccess.html';
			} else {
					cb();
			}
		});
	};
}]);

app.controller('RegisterController', ['$scope', 'RegisterService', function($scope, RegisterService) {
	$scope.registerFail = false;
	function registerFailed() {
		$scope.registerFail = true;
	}
	$scope.register = function() {
		RegisterService.register($scope.user, registerFailed);
	};
}]);
