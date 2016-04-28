angular.module('myApp')

.service('lessonsContentService', function($http, loginService) {
  let correctAnswerArray = [];
  let lessonName = '';
  let currentUserId = '';
  let tempId = ''; // var for moving from lessons to lessontests
  let clickedTopic = '';
  this.setTempId = (input) => {  // set parameter to get when moving from lessons to lessontests
    tempId = input;
  }
  this.setClickedTopic = (input) => {
    clickedTopic = input;
  }
  this.setCurrentUserId = (userId) => {
    currentUserId = userId;
  }
  this.setLessonName = (input) => {
    lessonName = input;
  }
  this.setCorrectAnswer = (input, index) => {
    correctAnswerArray[index] = input;
  }
  this.getTempId = () => {  // get when moving from lessons to lessontests
    return tempId;
  }
  this.getClickedTopic = () => {
    return clickedTopic;
  }
  this.getCorrectAnswerArray = () => {
    return correctAnswerArray;
  }
  this.resetArray = () => {
    correctAnswerArray = [];
  }
  this.getLessonInfo = (input) => {
    return $http ({
      method: 'GET',
      url: '/api/lessons/js/' + input
    })
  }
  this.updateProgress = (score) => {
    return $http ({
      method: 'PUT',
      url: '/api/lessons/progress',
      data: {score, lessonName, currentUserId}
    })
  }
})  // end lessonsContentService
