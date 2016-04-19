angular.module('myApp')

.directive('lessonTestsDirective', function($state, $templateRequest, $compile, $http) {

  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    // templateUrl: './html/lessonTests/lessonFiles/js-lesson-vars.html'
    link: function(scope, ele, attr) {

      // scope.blob = 'hi there';
      // console.log(scope);
      // console.log(scope.blob);

      // lesson test page load
      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          let temp = './html/lessonTests/lessonFiles/' + selectedParent.id + '.html';
          // console.log(temp);

          // temp = $http.get(temp).then(function(r) {
          //   console.log(r.data);
          //   // scope.loaded = r.data;
          //   // return scope.loaded;
          //   return r.data;
          // }).then(function(r) {
          //   $('.lesson-tests-wrapper').html(r);
          // })

          $('.lesson-tests-wrapper').load(temp);
        }

        $('html, body').animate({ scrollTop: 0 }, 300);
        if ($state.name !== 'lessonTests') {
          $state.go('lessonTests');
          setTimeout(function() {
            testNavigation();
            $('.lesson-sections', this).toggle('expand');
          }, 100)
        } else {
          testNavigation();
        }
      }) // end lesson-test click


    } // end link attr
  }

})
