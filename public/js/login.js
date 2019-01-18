var app = angular.module('login', []);

app.service('XHRService', function ($http) {
	this.request = function(usr, pwd, callback) {
		$http({
			method: 'POST',
			url: '/signin',
			data: {
				username: usr,
				password: pwd
			}
		}).then(function(res){
		 	if(res.status === 200) {
					callback(true);
			} else {
				callback(false);
			}
		}, function(res){
				// console.log('error on loging');
		});
	}
});

app.service('LoginService',['XHRService','$location', function(XHRService, $location){
	this.login = function(username, password, cb) {
		return XHRService.request(username, password, function(res) {
			if(res === true) {
				window.location = '/dashboard.html';
			} else {
				cb();
				// console.log('couldn\'t log in');
			}
		});
	};
}]);

app.controller('LoginController', ['$scope', 'LoginService', function($scope, LoginService){

	function loginFailed() {
		var elementUser = document.getElementById('username');
		var elementPass = document.getElementById('password');
		elementUser.classList.add( 'red-border');
		elementPass.classList.add( 'red-border');
	}

	$scope.login = function() {
		LoginService.login($scope.username, $scope.password, loginFailed);
	}
}]);
