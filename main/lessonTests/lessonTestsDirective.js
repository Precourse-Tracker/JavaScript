angular.module('myApp')

.directive('lessonTestsDirective', function() {

  return {
    restrict: 'A',
    link: function(scope, ele, attr) {

      $('.grade-test').click(function() {
        $('.final-score').css({
          'display': 'flex',
          'flex-direction': 'column'
        });
      })
      $('.reset-test').click(function() {
        $('.final-score').css('display', 'none');
      })

    }
  }

})  // end lessonTestsDirective
