angular.module('myApp')

.directive('lessonTestsDirective', function() {

  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    link: function(scope, ele, attr) {

      let testsParents = parentNode.parentNode.parentNode.parentNode;

      $('.lesson-test').click(function() {
        // console.log(this);
        // console.log(this.parentNode);
        console.log(this.testsParents.id);

        // $('.lesson-tests-wrapper')
      })

    }
  }

})
