angular.module('myApp')

.directive('lessonsSideBarDirective', function($state) {

  return {
    restrict: 'E',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        // console.log(this.parentNode);
        $('.lesson-sections', this.parentNode).toggle('expand');
      })

      // ---- end of previously working stuff ----- //

      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          // console.log(selectedParent.id);
          let temp = selectedParent.id;
          console.log(temp);
          switch (temp) {
            case 'js-lesson-vars':
              $('.js-lesson-vars').css('z-index', 2);
              $('.js-lesson-vars').siblings().css('z-index', 0);
              break;
            case 'js-lesson-strings':
              $('.js-lesson-strings').css('z-index', 2);
              $('.js-lesson-strings').siblings().css('z-index', 0);
              break;
            default:
              break;
          }

        }

        // $('html, body').animate({ scrollTop: 0 }, 300);

        if ($state.name !== 'lessonTests') {
          $state.go('lessonTests');
          setTimeout(function() {
            testNavigation();
          }, 100)
        } else {
          testNavigation();
        }
      }) // end lesson-test click

    } // end of directive link
  }

})  // end lessonsSideBarDirective
