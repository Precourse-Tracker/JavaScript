angular.module('myApp')

.service('lessonsContentService', function($http) {


  this.getLessonInfo = (input) => {
    return $http ({
      method: 'GET',
      url: '/api/lessons/js/' + input
    })
  }


})  // end lessonsContentService
