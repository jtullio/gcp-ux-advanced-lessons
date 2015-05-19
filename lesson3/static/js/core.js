// ./static/core.js
// Core controller for our app

var decisionMatrix = angular.module('decisionMatrix', []);

decisionMatrix.controller('mainController', ['$scope', '$http', function ($scope, $http) {
	$scope.formData = {};

	// Get all available items from the matrix
	$scope.get = function() {
		$http.get('/api/matrix')
		.success(function(data) {
			$scope.matrix = data;
			console.log(data);
		})
		.error(function(err) {
			console.log('Error in controller get(): ' + err);
		});
	};

	$scope.createItem = function() {
		$http.post('/api/matrix', $scope.formData)
			.success(function(data) {
				// $scope.formData = {};
				// $scope.matrix = data;
				// console.log(data);
				$scope.get();
			})
			.error(function(err) {
				console.log('Error in controller post(): ' + err);
			});
	}; // createItem

	$scope.deleteItem = function(id) {
		$http.delete('/api/matrix/' + id)
			.success(function(data) {
				// $scope.matrix = data;
				// console.log(data);
				$scope.get();
			})
			.error(function(data) {
				console.log('Error in controller delete(): ' + err);
			})
	}; // deleteItem

	$scope.get();
}]); // mainController