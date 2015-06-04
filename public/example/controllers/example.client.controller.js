
//retrieve example module and attach a controller ExampleController
angular.module('example').controller('ExampleController',['$scope',
	function($scope){
		$scope.name = 'MEAN Application';
	}
]);