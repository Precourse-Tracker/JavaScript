angular.module('myApp', ['ui.router'])

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
    // controller: 'lessonTestsController'
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

.controller('assessmentController', ["$scope", "assessmentService", function($scope, assessmentService) {

  $scope.getAssessment = () => {
    assessmentService.getLesson().then((assessment) => {
      $scope.assessment = assessment;
    })
  }

var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.getSession().setMode("ace/mode/javascript");

var editor_1 = ace.edit("editor_1");
editor_1.setTheme("ace/theme/chrome");
editor_1.getSession().setMode("ace/mode/javascript");

}])

angular.module('myApp').service('assessmentService', ["$q", "$http", function($q, $http) {


    this.getAssessment = () => {
        return $http({
            method: 'GET',
            url: '/api/assessment/js'
        }).then((response) => {
            return response;
        })
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

.directive('lessonsSideBarDirective', ["$state", function($state) {

  return {
    restrict: 'E',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        // console.log(this.parentNode);
        $('.lesson-sections', this.parentNode).toggle('expand');
      })

      // ---- end of previously working stuff ----- //

      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          // console.log(selectedParent.id);
          let temp = selectedParent.id;
          console.log(temp);
          switch (temp) {
            case 'js-lesson-vars':
              $('.js-lesson-vars').css('z-index', 2);
              $('.js-lesson-vars').siblings().css('z-index', 0);
              break;
            case 'js-lesson-strings':
              $('.js-lesson-strings').css('z-index', 2);
              $('.js-lesson-strings').siblings().css('z-index', 0);
              break;
            default:
              break;
          }

        }

        // $('html, body').animate({ scrollTop: 0 }, 300);

        if ($state.name !== 'lessonTests') {
          $state.go('lessonTests');
          setTimeout(function() {
            testNavigation();
          }, 100)
        } else {
          testNavigation();
        }
      }) // end lesson-test click

    } // end of directive link
  }

}])  // end lessonsSideBarDirective

angular.module('myApp')

.controller('lessonTestsController', ["$scope", "$state", "lessonTestsService", function($scope, $state, lessonTestsService) {

  $scope.test = 'test on ctrl';
  $scope.blob = 'blob on ctrl';

  // $scope.selectLesson = function(lesson) {
  //   // console.log(lesson);
  //   lessonTestsService.setLessonTest(lesson);
  //   // console.log(lessonTestsService.getLessonTest())
  //
  //   $scope.test = lessonTestsService.getLessonTest()
  //   .then(function(response) {
  //     console.log(response.data);
  //     // console.log($state.current.name);
  //     if ($state.current.name !== 'lessonTests') {
  //       $state.go('lessonTests');
  //       return response.value;
  //       // setTimeout(function() {
  //       //   $scope.test = response.data;
  //       // }, 100);
  //     } else {
  //       return response.value;
  //     }
  //   })
  //
  // }


}])

angular.module('myApp')

.directive('lessonTestsDirective', ["$state", "$templateRequest", "$compile", "$http", function($state, $templateRequest, $compile, $http) {

  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    // templateUrl: './html/lessonTests/lessonFiles/js-lesson-vars.html'
    link: function(scope, ele, attr) {

      // scope.blob = 'hi there';
      // console.log(scope);
      // console.log(scope.blob);

      // lesson test page load
      $('.lesson-test').click(function() {
        let selectedParent = this.parentNode.parentNode.parentNode.parentNode;
        let testNavigation = function() {
          let temp = './html/lessonTests/lessonFiles/' + selectedParent.id + '.html';
          // console.log(temp);

          // temp = $http.get(temp).then(function(r) {
          //   console.log(r.data);
          //   // scope.loaded = r.data;
          //   // return scope.loaded;
          //   return r.data;
          // }).then(function(r) {
          //   $('.lesson-tests-wrapper').html(r);
          // })

          $('.lesson-tests-wrapper').load(temp);
        }

        $('html, body').animate({ scrollTop: 0 }, 300);
        if ($state.name !== 'lessonTests') {
          $state.go('lessonTests');
          setTimeout(function() {
            testNavigation();
            $('.lesson-sections', this).toggle('expand');
          }, 100)
        } else {
          testNavigation();
        }
      }) // end lesson-test click


    } // end link attr
  }

}])

angular.module('myApp')

.service('lessonTestsService', ["$http", function($http) {

  this.lessonTest = '';

  this.setLessonTest = function(lesson) {
    lessonTest = lesson;
  }

  this.getLessonTest = function() {
    // return lessonTest;
    // console.log(lessonTest);
    return $http({
      method: 'GET',
      url: './html/lessonTests/lessonFiles/' + lessonTest + '.html',
      type: 'html'
    })
  }


}]) // end lessonTestsService

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

.directive('stringsTestDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-strings.html'
  }
}) // end varsTestDirective

angular.module('myApp')

.directive('varsTestDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-vars.html'
  }
}) // end varsTestDirective
