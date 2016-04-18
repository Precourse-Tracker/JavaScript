angular.module( 'myApp' )
  .directive( 'mountainDirective', function () {

    return {
      restrict: 'E',
      templateUrl: './html/mountain/mountainTemplate.html',
    }

  } ) // end mountainDirective
