angular.module('myApp')

.directive('unitTestMenuDirective', function() {

  return {
    restrict: 'AE',
    // templateUrl: './html/dashboard/dashboardTopTemplate.html',
    link: function(scope, ele, attr) {

      $('#dashboard-unit-tests').click(function() {
        // console.log(this);
        $('#unit-test-menu').toggle('expand');
      })

      $('#unit-test-menu').click(function() {
        $('#unit-test-menu').toggle('expand');
      })

      // unit test graph changes for unit views and cohort compare
      $('#js-graph').click(function() {
        $('#js-graph-div').css('z-index', 2);
        $('#js-graph-div').siblings().toggle().css('z-index', 0);
      })

      $('#html-graph').click(function() {
        $('#html-graph-div').css('z-index', 2);
        $('#html-graph-div').siblings().css('z-index', 0);
      })

      $('#css-graph').click(function() {
        $('#css-graph-div').css('z-index', 2);
        $('#css-graph-div').siblings().css('z-index', 0);
      })

      $('#git-graph').click(function() {
        $('#git-graph-div').css('z-index', 2);
        $('#git-graph-div').siblings().css('z-index', 0);
      })

      $('#cohort-compare').click(function() {
        // console.log(this);
        $('#cohort-graph-div').css('z-index', 2);
        $('#cohort-graph-div').siblings().css('z-index', 0);
      })

    }
  }

})  // end unitTestMenuDirective


/*

      $('#profile-wrapper').click(function() {
        profileMenu.toggle('expand')
      })
*/
