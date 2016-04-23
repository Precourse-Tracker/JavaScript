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
        const randomGrn = function ( rdL, rdH, grL, grH, buL, buH ) {
          let rd = Math.floor( randomMinMax( rdL, rdH ) );
          let grn = Math.floor( randomMinMax( grL, grH ) );
          let bl = Math.floor( randomMinMax( buL, buH ) );
          return ( 'rgb(' + rd + ', ' + grn + ', ' + bl + ')' );
        }
        var node = document.getElementById( 'home-top' );


        scope.spawnTrees = function ( number ) {
            for ( var i = 0; i < number; i++ ) {
              var aCoords = randomMinMax( -3, 33 );
              var x = aCoords;
              var y = randomMinMax( 5, findY( aCoords ) );

              const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );

              var i1 = document.createElement( 'i' );
              var i2 = document.createElement( 'i' );
              var i3 = document.createElement( 'i' );
              var i4 = document.createElement( 'i' );

              const newGrn = randomGrn( 60, 90, 70, 180, 60, 90 );

              var trunkZ = newZ - 1;

              // little guy top \\
              i1.style.zIndex = ( newZ );
              i1.style.border = '0.39em solid transparent';
              i1.style.borderBottom = '0.39em solid ' + newGrn;
              i1.style.left = ( x - 16.2 ) + 'em';
              i1.style.bottom = ( y - 23.9 ) + 'em';

              // mid branches \\
              i2.style.zIndex = ( newZ );
              i2.style.border = '0.55em solid transparent';
              i2.style.borderBottom = '0.55em solid ' + newGrn;
              i2.style.left = ( x - 16.4 ) + 'em';
              i2.style.bottom = ( y - 24.25 ) + 'em';

              // base branches \\
              i3.style.zIndex = ( newZ );
              i3.style.border = '0.55em solid transparent';
              i3.style.borderBottom = '0.75em solid ' + newGrn;
              i3.style.left = ( x - 16.4 ) + 'em';
              i3.style.bottom = ( y - 24.7 ) + 'em';

              // trunk bottom \\
              i4.style.zIndex = ( trunkZ );
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




          //////////////////////////////////
          //  <-------- Climber --------> //
          //////////////////////////////////
          // scope.spawnClimber = function(){
          //
          // }







        //////////////////////////////////
        //  <------  Mountain  ------>  //
        //////////////////////////////////
        //  <--------- ROCKS ---------> //
        //////////////////////////////////

        scope.spawnRocks = function ( number ) {
          for ( var i = 0; i < number; i++ ) {
            var aCoords = randomMinMax( -3, 33 );
            var x = aCoords;
            var y = randomMinMax( 5, findY( aCoords ) );

            const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );

            var rockZ = ( newZ - 10 );
            const newGryConst = function () {
              console.log('inside newGryConst: '+ (Math.floor( Math.random() * 100 )+ 75));
              return (Math.floor( Math.random() * 100 )+ 75);
            }
            let newGrlet = newGryConst();
            var newGrey = randomGrn( newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ) );
            console.log( 'newGrey: ' + newGrey );

            var r1 = document.createElement( 'i' );

            r1.style.zIndex = ( rockZ );
            r1.style.border = '0.39em solid transparent';
            r1.style.borderBottom = '0.39em solid ' + newGrey;
            r1.style.left = ( x - 16.2 ) + 'em';
            r1.style.bottom = ( y - 23.9 ) + 'em';



            node.appendChild( r1 );


          }
        }






        //////////////////////////////////
        //  <------ Snow Peak ------> //
        //////////////////////////////////

        scope.spawnSnowPeak = function ( number ) {
            for ( var i = 0; i < number; i++ ) {
              var aCoords = randomMinMax( -3, 33 );
              var x = aCoords;
              var y = randomMinMax( 5, findY( aCoords ) );

/* store low points in an array, new location is based on previous coords, so snow creeps down mountain. I can use the clusters on the ground as an interval to call this function, maybe every 8 clusters or something, the snow creeps further down. */

              const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
              var snowZ = ( newZ + 4 );

              var s1 = document.createElement( 'i' );
              var s2 = document.createElement( 'i' );
              var s3 = document.createElement( 'i' );
              var s4 = document.createElement( 'i' );
              var s5 = document.createElement( 'i' );
              var s6 = document.createElement( 'i' );
              var s7 = document.createElement( 'i' );

              // top
              s1.style.zIndex = ( snowZ );
              s1.style.borderWidth = '1.5em' ;
              s1.style.borderStyle = 'solid'
              s1.style.borderColor = 'transparent transparent rgb(246,246,246)';
              s1.style.left = ( -1.5 ) + 'em';
              s1.style.bottom = ( -1.44 ) + 'em';
              s1.style.borderRadius = '0.3em';

              // left
              s2.style.zIndex = ( snowZ );
              s2.style.borderWidth = '1.2em' ;
              s2.style.borderStyle = 'solid'
              s2.style.borderColor = 'transparent rgb(246,246,246) transparent transparent';
              s2.style.left = ( -3.7 ) + 'em';
              s2.style.bottom = ( -3.6 ) + 'em';
              s2.style.borderRadius = '0.3em';

              // right
              s3.style.zIndex = ( snowZ );
              s3.style.borderWidth = '1.2em' ;
              s3.style.borderStyle = 'solid'
              s3.style.borderColor = 'transparent transparent transparent rgb(246,246,246)';
              s3.style.left = ( 1.2 ) + 'em';
              s3.style.bottom = ( -3.6 ) + 'em';
              s3.style.borderRadius = '0.3em';

              // center
              s4.style.zIndex = ( snowZ );
              s4.style.height = ( 1.3 ) + 'em';
              s4.style.width = ( 2.65 )  + 'em';
              s4.style.backgroundColor = 'rgb(246,246,246)';
              s4.style.left = ( -1.4 ) + 'em';
              s4.style.bottom = ( -2.65 ) + 'em';

              // middle-left
              s5.style.zIndex = ( snowZ );
              s5.style.borderWidth = '0.6em' ;
              s5.style.borderStyle = 'solid'
              s5.style.borderColor = ' transparent transparent transparent rgb(246,246,246)';
              s5.style.left = ( -1.35 ) + 'em';
              s5.style.bottom = ( -3.55 ) + 'em';

              // middle-center
              s6.style.zIndex = ( snowZ );
              s6.style.borderWidth = '1em' ;
              s6.style.borderStyle = 'solid'
              s6.style.borderColor = 'rgb(246,246,246) transparent transparent transparent';
              s6.style.left = ( -1.4 ) + 'em';
              s6.style.bottom = ( -4.4 ) + 'em';

              // middle-right
              s7.style.zIndex = ( snowZ );
              s7.style.borderWidth = '0.9em' ;
              s7.style.borderStyle = 'solid'
              s7.style.borderColor = 'transparent rgb(246,246,246) transparent transparent';
              s7.style.left = ( -0.6 ) + 'em';
              s7.style.bottom = ( -3.48 ) + 'em';

              node.appendChild( s1 );
              node.appendChild( s2 );
              node.appendChild( s3 );
              node.appendChild( s4 );
              node.appendChild( s5 );
              node.appendChild( s6 );
              node.appendChild( s7 );
            }
          }
          /*
                  border: 1.08e m solid transparent;
                  margin - top: -1.08e m;
                  border - bottom: 1.08e m solid white;
                  left: 0.36e m;
                  top: 0e m;

                  border: 0.36e m solid transparent;
                  margin - left: -0.36e m;
                  border - right: 0.36e m solid white;
                  left: 0e m;
                  top: 1.15e m;

                  border: 0.36e m solid transparent;
                  border - left: 0.36e m solid white;
                  left: 0.36e m;
                  top: 1.15e m;

                  border: 0.36e m solid transparent;
                  border - top: 0.36e m solid white;
                  left: 0.36e m;
                  top: 1.15e m;

                  border: 0.61e m solid transparent;
                  border - top: 0.61e m solid white;
                  left: 0.65e m;
                  top: 1.59e m;

                  border: 0.39e m solid transparent;
                  border - left: 0.39e m solid white;
                  left: 2.60e m;
                  top: 1.15e m;

                  border: 0.39e m solid transparent;
                  margin - left: -0.39e m;
                  border - right: 0.39e m solid white;
                  left: 2.20e m;
                  top: 1.15e m;

                  border: 0.75e m solid transparent;
                  border - top: 0.75e m solid white;
                  left: 1.08e m;
                  top: 1.15e m;

                  border: 0.61e m solid transparent;
                  margin - top: -0.61e m;
                  border - bottom: 0.61e m solid white;
                  left: 0.65e m;
                  top: 1.15e m;

          */


          //////////////////////////////////
          //  <--------- clouds --------> //
          //////////////////////////////////
          scope.spawnClouds = function ( number ) {
              for ( var i = 0; i < number; i++ ) {
                var aCoords = randomMinMax( -3, 33 );
                var x = aCoords;
                var y = randomMinMax( 5, findY( aCoords ) );

                const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );

                var snowZ = ( newZ + 4 );

                var s1 = document.createElement( 'i' );

                s1.style.zIndex = ( snowZ );
                s1.style.border = '1.08em solid transparent';
                s1.style.borderBottom = '0.39em solid ' + '#FFF';
                s1.style.left = ( x - 16.2 ) + 'em';
                s1.style.bottom = ( y - 23.9 ) + 'em';

                node.appendChild( s1 );

              }
            }

        //////////////////////////////////
        //  <-------- closing --------> //
        //////////////////////////////////

      }
    }
    return dirDefinition;
  } ) // end mountainDirective

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
