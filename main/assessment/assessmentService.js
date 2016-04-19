angular.module('myApp')

.service('assessmentService', function($q, $http) {



    this.getAssessment = () => {
        return $http({
            method: 'GET',
            url: '/api/assessment/js'
        }).then((response) => {

            return response.data;
        })
    }

    this.ticker = (result) => {
      let tick = 0;
        if (result === true) {
          tick++;
        }else {
            return 0;
        }
        return tick;
    }

    // this.finalScore = (numOfQuestions) => {
    //
    //
    // }
})
