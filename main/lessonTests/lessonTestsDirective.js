angular.module('myApp')

.directive('lessonTestsDirective', function($state) {

  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    link: function(scope, ele, attr) {

      // lesson test page load
      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          $('.lesson-tests-wrapper').load('./html/lessonTests/lessonFiles/' + selectedParent.id + '.html');
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
