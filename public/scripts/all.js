angular.module('myApp', ['ui.router', 'ui.ace', 'ngWebworker'])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('login');

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: './html/login/loginTemplate.html'
  })
  .state('home', {
    url: '/home',
    templateUrl: './html/home/homeTemplate.html'
  })
  .state('lessons', {
    url: '/lessons',
    templateUrl: './html/lessons/lessonsTemplate.html'
  })
  .state('lessonTests', {
    url: '/lessonTests',
    templateUrl: './html/lessonTests/lessonTestsTemplate.html'
  })
  .state('assessment', {
    url: '/assessment',
    templateUrl: './html/assessment/assessmentTemplate.html'
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: './html/dashboard/dashboardTemplate.html'
  })

}]) // end config

angular.module('myApp')

.controller('assessmentController', ["$scope", "assessmentService", "workerService", function($scope, assessmentService, workerService) {

  assessmentService.getAssessment().then(function(response) {
    var list = [];
    _.each(response, function(item) {
      for (var i = 0; i < item.questions.length; i++) {
        list.push(item.questions[i]);
      }
    })
    // console.log(list);
    $scope.questions = list;
  });

$scope.eval = function(q, userCode) {


  let qId = q._id;
  let answer = q.answer;

  workerService.worker(qId, answer, userCode).then(function(result) {
    assessmentService.ticker(result);
  })

}

$scope.submitAssessment = (length) => {
  assessmentService.submitAssessment(length);
}

$scope.doSomeStuff = function(q) {
    q.disabled = true;
}


}]);

angular.module('myApp')

.service('assessmentService', ["$q", "$http", function($q, $http) {


    this.getAssessment = () => {
        return $http({
            method: 'GET',
            url: '/api/assessment/js'
        }).then((response) => {

            return response.data;
        })
    }

    var tick = 0;
    this.ticker = (result) => {
        if (result === true) {
          tick += 1;
        }else {
            return 0;
        }
        console.log("tick count", tick);
    }


    this.submitAssessment = (length) => {
      var totalScore = (tick / length) * 100;
      totalScore = totalScore.toString();
      console.log(totalScore);
      return $http({
        method: 'PUT',
        url: '/api/users',
        data: {
          progress: {
            jsAssessment: totalScore
          }
        }
      }).success(function(resp) {
        console.log(resp);
      })
    }
}])

angular.module('myApp').service('workerService', ["Webworker", function(Webworker) {

  this.worker = (qId, answer, userCode) => {

    function isSame(userCode, answer) {
      if (userCode === answer) {
        return true;
      } else {
        return false;
      }
    }

    var myWorker = Webworker.create(isSame, {
      isSame: true,
      onReturn: function(data) {return data;}
    });

    var result = myWorker.run(userCode, answer);
    return result;
  }
}])

angular.module('myApp')

.directive('unitTestMenuDirective', function() {

  return {
    restrict: 'AE',
    // templateUrl: './html/dashboard/dashboardTopTemplate.html',
    link: function(scope, ele, attr) {

      $('#dashboard-unit-tests').click(function() {
        // console.log(this);
        $('#unit-test-menu').toggle('expand');
      })

      $('#unit-test-menu').click(function() {
        $('#unit-test-menu').toggle('expand');
      })

      // unit test graph changes for unit views and cohort compare
      $('#js-graph').click(function() {
        $('#js-graph-div').css('z-index', 2);
        $('#js-graph-div').siblings().css('z-index', 0);
      })

      $('#html-graph').click(function() {
        $('#html-graph-div').css('z-index', 2);
        $('#html-graph-div').siblings().css('z-index', 0);
      })

      $('#css-graph').click(function() {
        $('#css-graph-div').css('z-index', 2);
        $('#css-graph-div').siblings().css('z-index', 0);
      })

      $('#git-graph').click(function() {
        $('#git-graph-div').css('z-index', 2);
        $('#git-graph-div').siblings().css('z-index', 0);
      })

      $('#cohort-compare').click(function() {
        // console.log(this);
        $('#cohort-graph-div').css('z-index', 2);
        $('#cohort-graph-div').siblings().css('z-index', 0);
      })

    }
  }

})  // end unitTestMenuDirective


/*

      $('#profile-wrapper').click(function() {
        profileMenu.toggle('expand')
      })
*/

angular.module('myApp')

.controller('lessonsContentController', ["$scope", "lessonsContentService", function($scope, lessonsContentService) {

  $scope.lessonInfo = (input) => {
    $scope.theTitle = lessonsContentService.getLessonInfo(input);
  }

}]) // end lessonsContentController

angular.module('myApp')

.directive('lessonsContentDirective', function() {
  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsContentTemplate.html',
    scope: {
      title: '='
    }
  }
}) // end lessonsContentDirective

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

angular.module('myApp')

.directive('lessonsSideBarDirective', ["$state", function($state) {

  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        // console.log(this.parentNode);
        $('.lesson-sections', this.parentNode).toggle('expand');
      })

      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          let temp = selectedParent.id;
          // console.log(temp);
          $('.lesson-tests-wrapper').css('display', 'block');

          switch (temp) {
            case 'js-lesson-data-types':
              $('.js-lesson-data-types').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-data-types').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-variables':
              $('.js-lesson-variables').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-variables').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-strings-cont':
              $('.js-lesson-strings-cont').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-strings-cont').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-conditional':
              $('.js-lesson-conditional').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-conditional').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-arrays':
              $('.js-lesson-arrays').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-arrays').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-objects':
              $('.js-lesson-objects').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-objects').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-iterators':
              $('.js-lesson-iterators').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-iterators').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-logical':
              $('.js-lesson-logical').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-logical').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            case 'js-lesson-functions':
              $('.js-lesson-functions').css({ 'display': 'block', 'z-index': 2 });
              $('.js-lesson-functions').siblings().css({ 'display': 'none', 'z-index': 0 });
              break;
            default:
              break;
          }
        } // end testNavigation

        $('html, body').animate({ scrollTop: 0 }, 300);
        // if ($state.name !== 'lessonTests') {
        //   $state.go('lessonTests');
        //   setTimeout(function() {
        //     testNavigation();
        //   }, 100)
        // } else {
        //   testNavigation();
        // }

        testNavigation();
      }) // end lesson-test click

    } // end of directive link
  }

}])  // end lessonsSideBarDirective

angular.module('myApp')

.controller('lessonTestsController', ["$scope", function($scope) {

  // $scope.test = 'test on ctrl';
  // $scope.blob = 'blob on ctrl';

  $scope.functionsChoices = [null];
  $scope.functionsCorrect = [
    null, // initial null val
    'a',  // q1
    'b',  // q2
    'a',  // q3
    'c'   //q4
  ]

  $scope.q1 = (input) => {
    $scope.functionsChoices[1] = input;
    // console.log('q1 choice is ' + input);
    console.log($scope.functionsChoices);
  }

  $scope.q2 = (input) => {
    $scope.functionsChoices[2] = input;
    // console.log('q2 choice is ' + input);
    console.log($scope.functionsChoices);
  }

  $scope.q3 = (input) => {
    $scope.functionsChoices[3] = input;
    console.log($scope.functionsChoices);
  }

  $scope.q4 = (input) => {
    $scope.functionsChoices[4] = input;
    console.log($scope.functionsChoices);
  }

  $scope.gradeTest = () => {
    let incorrect = null;
    let correct = -1;
    let finalScore = '';
    let numQuestions = $scope.functionsCorrect.length - 1;
    for (var i = 0; i < numQuestions + 1; i++) {
      if ($scope.functionsChoices[i] == $scope.functionsCorrect[i]) {
        correct++;
      }
    }
    finalScore = correct / numQuestions * 100;
    $scope.testScore = finalScore + '%';
    if (finalScore <= 60) {
      $scope.message = 'Good attempt! Please review the content and try again.';
    } else if (finalScore <= 85) {
      $scope.message = 'Nice job!  You\'re getter there!'
    } else if (finalScore <= 99) {
      $scope.message = 'Great job! You\'re close to 100%!';
    } else if (finalScore == 100) {
      $scope.message = 'Awesome!!  You got a perfect score!!';
    }
    $('html, body').animate({ scrollTop: 0 }, 300);
  }

  $scope.resetTest = () => {
    $scope.functionsChoices = [];
    $('html, body').animate({ scrollTop: 0 }, 300);
  }


}])  // end lessonTestsController

angular.module('myApp')

.directive('lessonTestsDirective', function() {

  return {
    restrict: 'A',
    link: function(scope, ele, attr) {

      $('.grade-test').click(function() {
        $('.final-score').css({
          'display': 'flex',
          'flex-direction': 'column'
        });
      })
      $('.reset-test').click(function() {
        $('.final-score').css('display', 'none');
      })

    }
  }

})  // end lessonTestsDirective

// angular.module('myApp')
//
// .service('lessonTestsService', function($http) {
//
//   this.lessonTest = '';
//
//   this.setLessonTest = function(lesson) {
//     lessonTest = lesson;
//   }
//
//   this.getLessonTest = function() {
//     // return lessonTest;
//     // console.log(lessonTest);
//     return $http({
//       method: 'GET',
//       url: './html/lessonTests/lessonFiles/' + lessonTest + '.html',
//       type: 'html'
//     })
//   }
//
//
// }) // end lessonTestsService

angular.module('myApp')
.controller('loginController', ["$scope", "loginService", function($scope, loginService){

  $scope.createUser = function(newUser) {
    loginService.newUser(newUser).then(function() {
      $scope.newUser.username = '';
      $scope.newUser.email = '';
      $scope.newUser.password = '';
      alert('You have successfully signed up. Please log in');
    })
  };
  $scope.userLogin = function(user) {
    loginService.userLogin(user);
  };

// jquery animations
  $(document).ready(function(){
  $('#goRight').on('click', function(){
    $('#slideBox').animate({
      'marginLeft' : '0'
    })
    $('.topLayer').animate({
      'marginLeft' : '100%'
    })
  })
  $('#goLeft').on('click', function(){
    $('#slideBox').animate({
      'marginLeft' : '50%'
    })
    $('.topLayer').animate({
      'marginLeft': '0'
    })
  })
})
}])

angular.module('myApp')

.directive('loginDirective', function() {

  return {
    restrict: 'E',
    templateUrl: './html/login/loginTemplate.html',
    link: function(scope, ele, attr) {

  

    }
  }

}) // end loginDirective

angular.module("myApp")
.service('loginService', ["$q", "$http", "$state", function($q, $http, $state) {

  this.userLogin = function(user) {
    return $http({
      method: 'POST',
      data: user,
      url: '/api/login'
    }).success(function() {
      $state.go('home');
    });
  };

  this.logoutUser = function() {
    return $http({
      method: 'GET',
      url: '/logout'
    }).success(function() {
       $state.go('login');
    });
  };

  this.newUser = function(newUser) {
    return $http({
      method: 'POST',
      data: newUser,
      url: '/api/signup'
    }).success(function() {
      return;
    });
  };

  this.getProfile = function() {
    return $http({
      method: 'GET',
      url: '/user/current'
    });
  };
}]);

angular.module('myApp')

.controller('navigationController', ["$scope", "loginService", function($scope, loginService) {

  $scope.logoutUser = function() {
    loginService.logoutUser();
  };

}])

angular.module('myApp')

.directive('navigationDirective', function() {

  return {
    restrict: 'E',
    templateUrl: './html/navigation/navigationTemplate.html',
    link: function(scope, ele, attr) {
      let profileMenu = $('#menu-navigation');

      $('#profile-wrapper').click(function() {
        profileMenu.toggle('expand')
      })

      profileMenu.click(function() {
        $('.lessons-wrapper').load();
        profileMenu.toggle('expand');
      })
    }
  }

}) // end navigationDirective

angular.module('myApp')

.directive('jsArraysDirectives', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-arrays.html'
  }
}) // end jsArraysDirectives

angular.module('myApp')

.directive('jsConditionalDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-conditional.html'
  }
}) // end jsConditionalDirective

angular.module('myApp')

.directive('jsDatatypesDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-data-types.html'
  }
}) // end dataTypesDirective

angular.module('myApp')

.directive('jsFunctionsDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-functions.html'
  }
}) // end varsTestDirective

angular.module('myApp')

.directive('jsIteratorsDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-iterators.html'
  }
}) // end varsTestDirective

angular.module('myApp')

.directive('jsLogicalDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-logical.html'
  }
}) // end varsTestDirective

angular.module('myApp')

.directive('jsObjectsDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-objects.html'
  }
}) // end varsTestDirective

angular.module('myApp')

.directive('jsStringsContDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-strings-cont.html'
  }
}) // end varsTestDirective

angular.module('myApp')

.directive('jsVariablesDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-variables.html'
  }
}) // end varsTestDirective
