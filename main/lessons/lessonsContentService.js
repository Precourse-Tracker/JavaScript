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

  let dummyData = {
    "name": "Data Types",
    "questions": [
      {
        "question": "Which of the following is an acceptable number in JavaScript",
        "multipleChoice": ["17", "1,055.28", "Neither A or B", "Both A and B"],
        "correctAnswer": "Both A and B"
      },
      {
        "question": "JavaScript will accept a negative number as a number",
        "multipleChoice": ["True", "False"],
        "correctAnswer": "True"
      },
      {
        "question": "You can only use double quotes for Strings, single quotes are not accepted.",
        "multipleChoice": ["True", "False"],
        "correctAnswer": "False"
      }
    ],
    "score": 0
  };

  this.getLessonInfo = (input) => {
    switch (input) {
      case 'js-lesson-data-types':
        return dummyData;
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
