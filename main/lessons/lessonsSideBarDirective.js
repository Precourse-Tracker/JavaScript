angular.module('myApp')

.directive('lessonsSideBarDirective', function() {

  return {
    restrict: 'E',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        // console.log(this.parentNode);
        $('.lesson-sections', this.parentNode).toggle('expand');

        // let closeOthers = allSiblings(this);
        // console.log(closeOthers);
      })

      // $('.lesson-group').click(function() {
      //   // console.log(this.parentNode);
      //   $('.lesson-title', this.parentNode).toggle('expand');
      // })

      // $('.lesson-test').click(function() {
      //   console.log(this);
      //   console.log(this.parentNode);
      //   console.log(this.parentNode.parentNode.parentNode.parentNode);
      // })

      // let allSiblings = function(elem) {
      //   let siblings = [];
      //   let sibling = elem.parentNode.firstChild;
      //   var skipMe = elem;
      //   for ( ; sibling; sibling = sibling.nextSibling) {
      //     if (sibling.nodeType == 1 && sibling != elem) {
      //       siblings.push(sibling);
      //     }
      //   }
      //   return siblings;
      // }



    }
  }

})  // end lessonsSideBarDirective
