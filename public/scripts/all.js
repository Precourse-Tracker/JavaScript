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

        const randomLocation = function ( xMin, xMax /*, yMin, yMax*/ ) {
          console.log( 'randomLocation is logging' );
          var posX = Math.floor( Math.random() * ( xMax - xMin + 1 ) ) + xMin;
          return {
            x: posX,
          }
        }

        scope.spawnTrees = function ( number ) {
          console.log( 'spawnTrees was called' );
          for ( var i = 0; i < number; i++ ) {
            var aCoords = randomLocation( -3, 33 /*, 5, 22*/ );
            var bCoords = randomLocation( -3, 33 /*, 5, 22*/ );
            var x = aCoords.x;
            var y = randomLocation( 5, findY( aCoords.x ) ).x;

            function findY( x ) {
              console.log( 'x from inside findY', x );
              var yMax
              if ( x < ( xMax / 2 ) ) {
                yMax = ( x + 7 );
              } else {
                yMax = ( xMax - x ) + 4;
              }
              return yMax;
            }
            console.log( 'spawnTrees was looped: ' + [ i + 1 ] + ' times' );
            var node = document.getElementById( 'mtn-wrapper' );
            var newDiv = document.createElement( 'div' );
            var i1 = document.createElement( 'i' );
            var i2 = document.createElement( 'i' );
            var i3 = document.createElement( 'i' );
            var i4 = document.createElement( 'i' );
            // newDiv.style.width = '2.4em';
            // newDiv.style.height = '2em';
            // newDiv.innerHTML = 'Hello';
            // newDiv.style.position = 'absolute';
            // newDiv.style.left = x + 'em';
            // newDiv.style.bottom = y + 'em';
            // newDiv.style.background = 'red';
            i1.style.width = '2em';
            i1.style.border = '0.55em solid transparent';
            i1.innerHTML = 'Hello';
            i1.style.margin = '-0.55em 0 0 0';
            i1.style.width = '';
            i1.style.width = '';
            i1.style.width = '';
            i1.style.width = '';
            i1.style.width = '';

/*.my-icon > i {
    : ;
    : ;
    border-bottom: 0.55em solid green;
    left: 1.045em;
    top: 0.78em;
}

.my-icon > i+i {

    border: 0.55em solid transparent;
    margin-top: -0.55em;
    border-bottom: 0.55em solid green;
    left: -0.2em;
    top: 0.47em;
}

.my-icon > i+i+i {
    position: relative;
    display: inline-block;
    width: 0;
    height: 0;
    line-height: 0;
    border: 0.39473684210526316em solid transparent;
    margin-top: -0.39473684210526316em;
    border-bottom: 0.39473684210526316em solid green;
    left: 1.185em;
    top: -1.1em;
}

.my-icon > i+i+i+i {
    position: relative;
    display: inline-block;
    border: 0px;
    border-style: none;
    width: 0.15em;
    height: 0.31em;
    background-color: #522200;
    left: 0.53em;
    top: -0.2em;
}*/


            node.appendChild( newDiv );
            node.appendChild( i1 );

            console.log( 'x: ' + x, 'y: ', y );
            console.log( newDiv.style );

            var currentDiv = document.getElementsByClassName( 'trees' )[ 0 ];
            // trees.insertBefore( newDiv, currentDiv );
          }
        }
      }
    }
    return dirDefinition;

  } ) // end mountainDirective

// various attempts at constraining trees \\
// var base = Math.abs( aCoords.x - bCoords.x );
// var height = Math.abs( aCoords.y - bCoords.y );
//
// console.log( 'base: ', base, 'height: ', height );
// var aLength = 3;
// var bLength = 4;
// var hypLength = Math.sqrt( aLength * aLength + bLength * bLength );
// // console.log('aCoordsX ', aCoords.x, 'aCoordsY: ', aCoords.y);



// better randomization \\
// var v1 = Math.floor( Math.random() * 10 );
// var v2 = Math.floor( Math.random() * 10 );
// var a1 = Math.floor( Math.random() * 10 );
// var a2 = Math.floor( Math.random() * 10 );
// var vy1 = Math.floor( Math.random() * 10 );
// var vy2 = Math.floor( Math.random() * 10 );
// var ay1 = Math.floor( Math.random() * 10 );
// var ay2 = Math.floor( Math.random() * 10 );
// var Qx = Math.floor( ( ( a1 * v1 ) + ( a2 * v2 ) ) / 10 );
// var Qy = Math.floor( ( ( ay1 * vy1 ) + ( ay2 * vy2 ) ) / 10 );
// console.log( 'Qx: ', Qx );
// console.log( 'Qy: ', Qy );

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
