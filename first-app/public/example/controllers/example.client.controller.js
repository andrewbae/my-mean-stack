// ng-app="example"
// ng-controller="ExampleController"
angular.module('example').controller('ExampleController', ['$scope', 'Authentication',
  function($scope, Authentication) {
    $scope.authentication = Authentication;
  }
]);
