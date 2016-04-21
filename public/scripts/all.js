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

.directive('lessonsSideBarDirective', function() {

  return {
    restrict: 'E',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        // console.log(this.parentNode);
        $('.lesson-sections', this.parentNode).toggle('expand');
      })

      // $('.lesson-group').click(function() {
      //   // console.log(this.parentNode);
      //   $('.lesson-title', this.parentNode).toggle('expand');
      // })

      // $('.lesson-test').click(function() {
      //   console.log(this);
      //   console.log(this.parentNode);
      //   console.log(this.parentNode.parentNode.parentNode.parentNode);
      // })

    }
  }

})  // end lessonsSideBarDirective

angular.module('myApp')

.controller('lessonTestsController', ["$scope", function($scope) {

}])

angular.module('myApp')

.directive('lessonTestsDirective', function() {

  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    link: function(scope, ele, attr) {

      $('.lesson-test').click(function() {
        let testsParents = this.parentNode.parentNode.parentNode.parentNode;
        // console.log(testsParents.id); // id of parent lesson name
        // $('.lesson-tests-wrapper').html('<span>' + testsParents.id + '</span>');
        $('.lesson-tests-wrapper').load('./html/lessonTests/lessonFiles/' + testsParents.id + '.html');
        $('html, body').animate({ scrollTop: 0 }, 300);
      })

    }
  }

})

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
        profileMenu.toggle('expand');
      })
    }
  }

}) // end navigationDirective

angular.module( 'myApp' )
  .controller( 'mountainController', [ '$scope', 'loginService', function ( $scope, loginService ) {

    $scope.logoutUser = function () {
      loginService.logoutUser();
    };


} ] );

angular.module( 'myApp' )
  .directive( 'mountainDirective', function () {
    var dirDefinition = {
      restrict: 'E',
      templateUrl: './html/mountain/mountainTemplate.html',
      controller: 'mountainController',
      link: function ( scope, element, attrs, controller, transcludeFn, animate ) {
        const xMin = -3;
        const xMax = 33;

        const randomMinMax = function ( xMin, xMax ) {
          var posX = Math.random() * ( xMax - xMin + 1 ) + xMin;
          return posX
        }

        const findY = function ( x ) {
          var yMax
          if ( x < ( xMax / 2 ) ) {
            yMax = ( x + 7 );
          } else {
            yMax = ( xMax - x ) + 5;
          }
          return yMax;
        }
        const randomGrn = function () {
          let rd = Math.floor( randomMinMax( 60, 90 ) );
          let grn = Math.floor( randomMinMax( 70, 180 ) );
          let bl = Math.floor( randomMinMax( 60, 90 ) );
          return ( 'rgb(' + rd + ', ' + grn + ', ' + bl + ')' );
        }

        scope.spawnTrees = function ( number ) {
          for ( var i = 0; i < number; i++ ) {
            var aCoords = randomMinMax( -3, 33 );
            var bCoords = randomMinMax( -3, 33 );
            var x = aCoords;
            var y = randomMinMax( 5, findY( aCoords ) );

            var node = document.getElementById( 'home-top' );
            var myTrees = document.getElementById( 'my-icon' );

            var i1 = document.createElement( 'i' );
            var i2 = document.createElement( 'i' );
            var i3 = document.createElement( 'i' );
            var i4 = document.createElement( 'i' );

            var newGrn = randomGrn();
            var newZ = (220 + (Math.floor(Math.floor(10 - (100*y))/10)));
            console.log(newZ);
            var trunkZ = newZ - 1;

            // little guy top \\
            i1.style.zIndex = (newZ);
            i1.style.border = '0.39em solid transparent';
            i1.style.borderBottom = '0.39em solid ' + newGrn;
            i1.style.left = ( x - 16.2 ) + 'em';
            i1.style.bottom = ( y -24.9 ) + 'em';

            // mid branches \\
            i2.style.zIndex = (newZ);
            i2.style.border = '0.55em solid transparent';
            i2.style.borderBottom = '0.55em solid ' + newGrn;
            i2.style.left = ( x - 16.4 ) + 'em';
            i2.style.bottom = ( y -24.25 ) + 'em';

            // base branches \\
            i3.style.zIndex = (newZ);
            i3.style.border = '0.55em solid transparent';
            i3.style.borderBottom = '0.75em solid ' + newGrn;
            i3.style.left = ( x - 16.4 ) + 'em';
            i3.style.bottom = ( y -24.7 ) + 'em';

            // trunk bottom \\
            i4.style.zIndex = (trunkZ);
            i4.style.border = 'none';
            i4.style.width = '.15em';
            i4.style.height = '0.31em';
            i4.style.marginBottom = '0em';
            i4.style.backgroundColor = '#522200';
            i4.style.left = ( x - 16 ) + 'em';
            i4.style.bottom = ( y - 25 ) + 'em';

            node.appendChild( i1 );
            node.appendChild( i2 );
            node.appendChild( i3 );
            node.appendChild( i4 );
          }
        }
        // scope.spawnClimber = function(){
        //
        // }
      }
    }
    return dirDefinition;

  } ) // end mountainDirective
