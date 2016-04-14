angular.module('myApp')

.directive('unitTestMenuDirective', function() {

  return {
    restrict: 'AE',
    // templateUrl: './html/dashboard/dashboardTopTemplate.html',
    link: function(scope, ele, attr) {

      $('#dashboard-top').click(function() {
        // console.log(this);
        $('#unit-test-menu').toggle('expand');
      })

    }
  }

})  // end unitTestMenuDirective
