angular.module('myApp')

.controller('lessonTestsController', function($scope) {

  var vm = this;

  vm.test = 'hi there';
  $scope.test = 'scope hi';

})
