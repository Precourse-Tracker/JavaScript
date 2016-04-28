angular.module('myApp')

.directive('lessonsContentDirective', function() {
  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsContentTemplate.html',
    scope: {
      title: '=',
      testObject: '=',
      testScore: '='
    },
    link: function (scope, ele, attr) {
      $('.answer-clicked').click(function(){
        console.log(this);
      })
    }
  }
}) // end lessonsContentDirective
