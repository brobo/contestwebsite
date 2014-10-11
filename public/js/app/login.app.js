angular.module('LoginApp', [])
	.controller('LoginController', function($scope, $http) {
		
		$http.get('/api/schools')
			.success(function(res) {
				$scope.schoolNames = res;
				console.log(res);
			});

	});