angular.module('myApp')

.service('lessonsContentService', function($http) {


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
    return $http ({
      method: 'GET',
      url: '/api/lessons/js/' + input
    })
  }


})  // end lessonsContentService
