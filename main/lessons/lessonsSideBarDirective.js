angular.module('myApp')

.directive('lessonsSideBarDirective', function($state) {

  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        // console.log(this.parentNode);
        $('.lesson-sections', this.parentNode).toggle('expand');
        $('.lesson-tests-wrapper').css('display', 'none');
      })

      $('.lesson-test').click(function() {
        $('.lesson-tests-wrapper').css('display', 'block');
        $('html, body').animate({ scrollTop: 0 }, 300);
      }) // end lesson-test click

    } // end of directive link
  }

})  // end lessonsSideBarDirective
