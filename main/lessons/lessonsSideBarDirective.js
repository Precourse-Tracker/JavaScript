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
          $('.lesson-tests-wrapper').css('display', 'block');

          switch (temp) {
            case 'js-lesson-data-types':
              $('.js-lesson-data-types').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-data-types').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-variables':
              $('.js-lesson-variables').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-variables').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-strings-cont':
              $('.js-lesson-strings-cont').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-strings-cont').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-conditional':
              $('.js-lesson-conditional').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-conditional').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-arrays':
              $('.js-lesson-arrays').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-arrays').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-objects':
              $('.js-lesson-objects').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-objects').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-iterators':
              $('.js-lesson-iterators').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-iterators').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-logical':
              $('.js-lesson-logical').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-logical').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-functions':
              $('.js-lesson-functions').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-functions').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            default:
              break;
          }
        } // end testNavigation

        $('html, body').animate({ scrollTop: 0 }, 300);
        // if ($state.name !== 'lessonTests') {
        //   $state.go('lessonTests');
        //   setTimeout(function() {
        //     testNavigation();
        //   }, 100)
        // } else {
        //   testNavigation();
        // }

        testNavigation();
      }) // end lesson-test click

    } // end of directive link
  }

})  // end lessonsSideBarDirective
