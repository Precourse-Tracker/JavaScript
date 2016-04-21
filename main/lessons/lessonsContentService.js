angular.module('myApp')

.service('lessonsContentService', function() {

  let jsDataTypes = 'Data Types',
      jsVariables = 'Variables',
      jsStrings = 'Strings',
      jsConditional = 'Conditional Operators',
      jsArrays = "Arrays",
      jsObjects = 'Objects',
      jsIterators = 'Iterators',
      jsLogical = 'Logical Operators',
      jsFunctions = 'Functions';

  this.getLessonInfo = (input) => {
    switch (input) {
      case 'js-lesson-data-types':
        return jsDataTypes;
        // break;
      case 'js-lesson-variables':
        return jsVariables;
        // break;
      case 'js-lesson-strings-cont':
        return jsStrings;
        // break;
      case 'js-lesson-conditional':
        return jsConditional;
        // break;
      case 'js-lesson-arrays':
        return jsArrays;
        // break;
      case 'js-lesson-objects':
        return jsObjects;
        // break;
      case 'js-lesson-iterators':
        return jsIterators;
        // break;
      case 'js-lesson-logical':
        return jsLogical;
        // break;
      case 'js-lesson-functions':
        return jsFunctions;
        // break;
      default:
        break;
    }
  }


})  // end lessonsContentService
