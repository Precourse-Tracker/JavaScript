angular.module('myApp')

.directive('lessonTestsDirective', function() {

  return {
    restrict: 'A',
    link: function(scope, ele, attr) {
      $('.reset-test').click(function() {
        $('.final-score').css('display', 'none');
      })
      $('.lessons').click(function(){
        $('.final-score').css('display', 'none');
      })
    }
  }

})  // end lessonTestsDirective
