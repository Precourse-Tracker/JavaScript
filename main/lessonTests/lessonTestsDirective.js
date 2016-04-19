angular.module('myApp')

.directive('lessonTestsDirective', function($state, $compile) {

  return {
    restrict: 'A',
    link: function(scope, ele, attr) {

      // scope.blob = 'hi there';
      // console.log(scope);
      // console.log(scope.blob);

      // lesson test page load
      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          let temp = './html/lessonTests/lessonFiles/' + selectedParent.id + '.html';


          console.log(temp);



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
