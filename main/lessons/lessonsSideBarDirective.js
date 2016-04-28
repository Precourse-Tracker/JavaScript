angular.module('myApp')

.directive('lessonsSideBarDirective', function($state, $http, $q, lessonsContentService) {

  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        let that = this;
        
        if ($state.name !== 'lessons') {
          $state.go('lessons')
        }
        $('.lesson-sections', that.parentNode).toggle('expand');
        $('.lesson-tests-wrapper').css('display', 'none');
      })

      let testNavigation = () => {
        $('.lesson-tests-wrapper').css('display', 'block');
        $('html, body').animate({ scrollTop: 0 }, 300);
      }

      $('.lesson-test').click(function() {
        let lessonId = lessonsContentService.getTempId();
        if ($state.name !== 'lessonTests') {
          $state.go('lessonTests');
          setTimeout(() => {
            testNavigation();
          }, 100);
        } else {
          testNavigation();
        }
      }) // end lesson-test click

    } // end of directive link
  }

})  // end lessonsSideBarDirective
