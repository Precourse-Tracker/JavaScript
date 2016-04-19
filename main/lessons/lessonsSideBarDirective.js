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

      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          let temp = selectedParent.id;
          // console.log(temp);
          switch (temp) {
            case 'js-lesson-data-types':
              $('.js-lesson-data-types').css('z-index', 2);
              $('.js-lesson-data-types').siblings().css('z-index', 0);
              break;
            case 'js-lesson-variables':
              $('.js-lesson-variables').css('z-index', 2);
              $('.js-lesson-variables').siblings().css('z-index', 0);
              break;
            case 'js-lesson-strings-cont':
              $('.js-lesson-strings-cont').css('z-index', 2);
              $('.js-lesson-strings-cont').siblings().css('z-index', 0);
              break;
            case 'js-lesson-conditional':
              $('.js-lesson-conditional').css('z-index', 2);
              $('.js-lesson-conditional').siblings().css('z-index', 0);
              break;
            case 'js-lesson-arrays':
              $('.js-lesson-arrays').css('z-index', 2);
              $('.js-lesson-arrays').siblings().css('z-index', 0);
              break;
            case 'js-lesson-objects':
              $('.js-lesson-objects').css('z-index', 2);
              $('.js-lesson-objects').siblings().css('z-index', 0);
              break;
            case 'js-lesson-iterators':
              $('.js-lesson-iterators').css('z-index', 2);
              $('.js-lesson-iterators').siblings().css('z-index', 0);
              break;
            case 'js-lesson-logical':
              $('.js-lesson-logical').css('z-index', 2);
              $('.js-lesson-logical').siblings().css('z-index', 0);
              break;
            case 'js-lesson-functions':
              $('.js-lesson-functions').css('z-index', 2);
              $('.js-lesson-functions').siblings().css('z-index', 0);
              break;
            default:
              break;
          }
        } // end testNavigation

        $('html, body').animate({ scrollTop: 0 }, 300);
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
