angular.module('myApp')

.controller('lessonsContentController', function($scope) {

  let jsDataTypes = 'Data Types',
      jsVariables = 'Variables',
      jsStrings = 'Strings',
      jsConditional = 'Conditional Operators',
      jsArrays = "Arrays",
      jsObjects = 'Objects',
      jsIterators = 'Iterators',
      jsLogical = 'Logical Operators',
      jsFunctions = 'Functions';

  $scope.getLessonInfo = (lessonType) => {
    // console.log(lessonType);
    switch (lessonType) {
      case 'js-lesson-data-types':
        $scope.theTitle = jsDataTypes;
        // console.log($scope.theTitle);
        break;
      case 'js-lesson-variables':
        $scope.theTitle = jsVariables;
        break;

      default:
        break;
    }
  }

}) // end lessonsContentController
