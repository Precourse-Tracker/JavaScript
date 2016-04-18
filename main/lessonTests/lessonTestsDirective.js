angular.module('myApp')

.directive('lessonTestsDirective', function() {

  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    link: function(scope, ele, attr) {

      $('.lesson-test').click(function() {
        let testsParents = this.parentNode.parentNode.parentNode.parentNode;
        // console.log(testsParents.id); // id of parent lesson name
        // $('.lesson-tests-wrapper').html('<span>' + testsParents.id + '</span>');
        $('.lesson-tests-wrapper').load('./html/lessonTests/lessonFiles/' + testsParents.id + '.html');
        $('html, body').animate({ scrollTop: 0 }, 300);
      })

    }
  }

})
