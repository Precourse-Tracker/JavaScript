angular.module('myApp').service('assessmentService', function($q, $http) {


    this.getAssessment = () => {
        return $http({
            method: 'GET',
            url: '/api/assessment/js'
        }).then((response) => {
          console.log('service', response);
            return response;
        })
    }
})
