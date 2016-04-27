angular.module('myApp')

.service('lessonsContentService', function($http) {
  let correctAnswerArray = [];
  this.setCorrectAnswer = (input, index) => {
    correctAnswerArray[index] = input;
  }
  this.getCorrectAnswerArray = () => {
    return correctAnswerArray;
  }
  this.resetArray = () => {
    correctAnswerArray = [];
  }
  this.getLessonInfo = () => {
    return $http ({
      method: 'GET',
      url: '/api/lessons/js'
    }).then(function(response) {
      console.log("response", response);
      return response.data;
    })
  }
  
})  // end lessonsContentService
