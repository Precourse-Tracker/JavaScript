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
  $scope.userAnswerArray = [];
  $scope.lessonInfo = (input) => {
      lessonsContentService.resetArray();
      $scope.lessonContent = lessonsContentService.getLessonInfo(input).then(function(lesson) {
        $scope.testObject = lesson.data[0];
        $scope.theTitle = $scope.testObject.name;
        $scope.testIndex = $scope.testObject.questions.forEach(function(entry, index){
            entry.index = index;
            lessonsContentService.setCorrectAnswer(entry.correctAnswer, index);
        })
    })
  }
  $scope.addAnswer = (userAnswer) => {
    $scope.userAnswerArray[userAnswer[1]]=userAnswer[0];
  }
  $scope.gradeTest = () => {
    let rightAnswer = 0;
    let user = $scope.userAnswerArray;
    let correct = lessonsContentService.getCorrectAnswerArray();
    if (user.length === correct.length) {
      user.forEach(function(entry, index){
        if (entry === correct[index]) {
          rightAnswer++;
        }
      })
      let score = (rightAnswer / correct.length) * 100;
      if (score === 100) {
        $scope.testScore = score.toFixed(0);
      }
      else {
        $scope.testScore = score.toFixed(2);
      }
      if (score <= 60) {
        $scope.message = 'Good attempt! Please review the content and try again.';
      } else if (score <= 80) {
        $scope.message = 'Nice job!  You\'re getting there!'
      } else if (score <= 90) {
        $scope.message = 'Great work All-Star! ';
      } else if (score < 100) {
        $scope.message = 'Great job! Almost perfect!';
      } else if (score == 100) {
        $scope.message = 'Awesome!!  You got a perfect score!!';
      }
    }
    else {
      alert('Please answer all questions before submitting');
    }
  }

}]) // end lessonsContentController

angular.module('myApp')

.directive('lessonsContentDirective', function() {
  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsContentTemplate.html',
    scope: {
      title: '=',
      testObject: '=',
      testScore: '='
    }
  }
}) // end lessonsContentDirective

angular.module('myApp')

.service('lessonsContentService', ["$http", function($http) {
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
  this.getLessonInfo = (input) => {
    return $http ({
      method: 'GET',
      url: '/api/lessons/js/' + input
    })
  }
}])  // end lessonsContentService

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
        $('.lesson-tests-wrapper').css('display', 'none');
      })

      $('.lesson-test').click(function() {
        $('.lesson-tests-wrapper').css('display', 'block');
        $('html, body').animate({ scrollTop: 0 }, 300);
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

angular.module( 'myApp' )
  .controller( 'mountainController', [ '$scope', 'loginService', function ( $scope, loginService ) {

    $scope.logoutUser = function () {
      loginService.logoutUser();
    };


} ] );

angular.module( 'myApp' ).directive( 'mountainDirective', function () {
    var dirDefinition = {
      restrict: 'E',
      templateUrl: './html/mountain/mountainTemplate.html',
      controller: 'mountainController',
      link: function ( scope, element, attrs, controller, transcludeFn, animate ) {
        const xMin = -3;
        const xMax = 33;

        // random number generator given a minimum and maximum range.
        const randomMinMax = function ( xMin, xMax ) {
          var posX = Math.random() * ( xMax - xMin + 1 ) + xMin;
          return posX
        }

        // programmatically determines y coordinates on a triangular plane.
        const findY = function ( x ) {
          var yMax
          if ( x < ( xMax / 2 ) ) {
            yMax = ( x + 7 );
          } else {
            yMax = ( xMax - x ) + 5;
          }
          return yMax;
        }

        // converts hsl color values to rgb
        function hslToRgb( h, s, l ) {
          var r, g, b;
          if ( s == 0 ) {
            r = g = b = l; // achromatic
          } else {
            var hue2rgb = function hue2rgb( p, q, t ) {
              if ( t < 0 ) t += 1;
              if ( t > 1 ) t -= 1;
              if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
              if ( t < 1 / 2 ) return q;
              if ( t < 2 / 3 ) return p + ( q - p ) * ( 2 / 3 - t ) * 6;
              return p;
            }
            var q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb( p, q, h + 1 / 3 );
            g = hue2rgb( p, q, h );
            b = hue2rgb( p, q, h - 1 / 3 );
          }
          return [ Math.round( r * 255 ), Math.round( g * 255 ), Math.round( b * 255 ) ];
        }

        // converts rgb color value ot hsl
        function rgb2hsl( rgbArr ) {
          var r1 = rgbArr[ 0 ] / 255;
          var g1 = rgbArr[ 1 ] / 255;
          var b1 = rgbArr[ 2 ] / 255;

          var maxColor = Math.max( r1, g1, b1 );
          var minColor = Math.min( r1, g1, b1 );
          //Calculate Lightness:
          var L = ( maxColor + minColor ) / 2;
          var S = 0;
          var H = 0;
          if ( maxColor != minColor ) {
            //Calculate Saturation:
            if ( L < 0.5 ) {
              S = ( maxColor - minColor ) / ( maxColor + minColor );
            } else {
              S = ( maxColor - minColor ) / ( 2.0 - maxColor - minColor );
            }
            //Calculate Hue:
            if ( r1 == maxColor ) {
              H = ( g1 - b1 ) / ( maxColor - minColor );
            } else if ( g1 == maxColor ) {
              H = 2.0 + ( b1 - r1 ) / ( maxColor - minColor );
            } else {
              H = 4.0 + ( r1 - g1 ) / ( maxColor - minColor );
            }
          }
          L = L * 100;
          S = S * 100;
          H = H * 60;
          if ( H < 0 ) {
            H += 360;
          }
          var result = [ H, S, L ];
          return result;
        }

        // creates a random color given a specific range
        const randomClr = function ( rdL, rdH, grL, grH, buL, buH ) {
          let rd = Math.floor( randomMinMax( rdL, rdH ) );
          let grn = Math.floor( randomMinMax( grL, grH ) );
          let bl = Math.floor( randomMinMax( buL, buH ) );
          return ( 'rgb(' + rd + ', ' + grn + ', ' + bl + ')' );
        }

        const lighten = function ( colorStr, amount ) {
          color = colorStr.match( /\d+/g ).map( v => parseInt( v ) );
          amount = ( amount === 0 ) ? 0 : ( amount || 10 );
          let hsl = rgb2hsl( color );
          hsl[ 2 ] += ( amount );
          return hsl;
        }

        // var myNodeList = document.querySelectorAll( 'li' );
        // mountainSvc.myForEach( myNodeList, function ( index, value ) {
        //   console.log( index, value );
        // } );




        // function darken( color, amount ) {
        //     amount = ( amount === 0 ) ? 0 : ( amount || 10 );
        //     var hsl = tinycolor( color ).toHsl();
        //     hsl.l -= amount / 100;
        //     hsl.l = clamp01( hsl.l );
        //     return tinycolor( hsl );
        //   }




        //////////////////////////////
        // <------ The DOM -------> //
        //////////////////////////////


        // determines which DOM element to append created elements.
        var node = document.getElementById( 'mountainScene-right' );
        let mSLeft = document.getElementById( 'mountainScene-left' );
        let mSRight = document.getElementById( 'mountainScene-right' );
        let bgmLeft = document.getElementById( 'bgMountain-Left' );
        let bgmRight = document.getElementById( 'bgMountain-right' );
        let bgDirt = document.getElementById('bigDirt');
        var sk1 = document.createElement( 'i' );
        var gr1 = document.createElement( 'i' );


        // console.log( lighten( 'rgb(1, 70, 49)', 50 ) );
        //////////////////////////////
        // <----- Time of Day ----> //
        ////////////////////////// ////
        // handles all time related styling changes

        // retrieves users time
        let dt = new Date();
        let tz = dt.getTimezoneOffset();
        // let localHours = dt.getHours();
        let localHours = 8;

        // TODO:
        var slidePos = document.getElementById( 'sliderSun' ).value;

        // simulates the passage of time.
        timePassing = function ( newValue ) {
          document.getElementById( "range" ).innerHTML = newValue;
          slidePos = newValue;
          console.log( parseInt( slidePos ) );
          // instantiating properties
          mSLeft.style.borderBottomColor = 'hsl(30, 23%, 29%)';
          mSRight.style.borderBottomColor = 'hsl(48, 15%, 40%)';
          bgmLeft.style.borderBottomColor = 'rgb( 82, 59, 40 )';
          bgmRight.style.borderBottomColor = 'rgb( 103, 95, 63 )';
          bgDirt.style.borderColor = 'rgb(66, 59, 45)';
          bgDirt.style.boxShadow = '13em -3.4em 1px -2.75em rgb(66, 59, 45)';
          sk1.style.backgroundColor = 'rgb(28, 24, 94)';
          gr1.style.backgroundColor = 'rgb(35, 48, 20)';

          // grabs the element, retrieves it's color, parses it to an array of int values, logs it to the console.
          mSLeft.rgbColor = mSLeft.style.borderBottomColor;
          mSRight.rgbColor = mSRight.style.borderBottomColor;
          bgmLeft.rgbColor = bgmLeft.style.borderBottomColor;
          bgmRight.rgbColor = bgmRight.style.borderBottomColor;
          bgDirt.rgbColor = bgDirt.style.borderColor;
          sk1.rgbColor = sk1.style.backgroundColor;
          gr1.rgbColor = gr1.style.backgroundColor;

          // take that array, run it through the rgb to hsl function, then increase the lightness depending on time of day.
          mSLeft.style.borderBottomColor = daylight( slidePos, mSLeft.rgbColor );
          mSRight.style.borderBottomColor = daylight( slidePos, mSRight.rgbColor );
          bgmLeft.style.borderBottomColor = daylight( slidePos, bgmLeft.rgbColor );
          bgmRight.style.borderBottomColor = daylight( slidePos, bgmRight.rgbColor );
          bgDirt.style.borderColor = daylight( slidePos, bgDirt.rgbColor );
          bgDirt.style.boxShadow = (bgDirt.style.borderColor + '13em -3.4em 1px -2.75em' );
          console.log(bgDirt.style);
          console.log('what the fuck', bgDirt.style.borderColor);
          sk1.style.backgroundColor = daylight( slidePos, sk1.rgbColor );
          gr1.style.backgroundColor = daylight( slidePos, gr1.rgbColor );
        }


        // controls day and night phasing in and out.
        const daylight = function ( slPos, rgbArr ) {
          var mult = Math.round( slPos * 2 );
          let newRgbArr = lighten( rgbArr, mult );
          var hslFormatted = ( 'hsl(' + Math.round( newRgbArr[ 0 ] ) + ', ' + Math.round( newRgbArr[ 1 ] ) + '%, ' + Math.round( newRgbArr[ 2 ] ) + '%)' );
          if ( slPos >= 12 ) {
            mult = ( ( Math.abs( Math.round( slPos ) - 24 ) ) / 0.8 );
            rgbArr = lighten( rgbArr, mult );
            hslFormatted = ( 'hsl(' + Math.round( rgbArr[ 0 ] ) + ', ' + Math.round( rgbArr[ 1 ] ) + '%, ' + Math.round( rgbArr[ 2 ] ) + '%)' );
          }
          return hslFormatted;
        }


        //////////////////////////////
        // <----- Background -----> //
        //////////////////////////////

        scope.spawnBackground = function ( date, trouble ) {
            const node = document.getElementById( 'mtn-wrapper' );

            // sky
            sk1.style.backgroundColor = 'rgb(28, 24, 94)';
            sk1.style.zIndex = ( -50 );
            sk1.style.width = '100vw';
            sk1.style.height = '50vh';
            sk1.style.left = ( 0 ) + 'vw';
            sk1.style.top = ( 0 ) + 'vh';
            sk1.style.margin = '0px';

            // ground
            gr1.style.backgroundColor = 'rgb(35, 48, 20)';
            gr1.style.zIndex = ( -50 );
            gr1.style.width = '100%';
            gr1.style.height = '50vh';
            gr1.style.left = ( 0 ) + 'vw';
            gr1.style.top = ( 50 ) + 'vh';
            gr1.style.margin = '0px';

            // distant horizon
            // moon
            // stars

            node.appendChild( sk1 );
            node.appendChild( gr1 );

            scope.add = ( function () {
              var counter = 0;
              return function () {
                console.log( counter );
                return counter += 1;

              }
            } )();
          } // end background


        //////////////////////////////////
        //  <--------- clouds --------> //
        //////////////////////////////////
        let cloudCount = 1;
        // I had a heck of a time with getting a closure to work here. It only worked, when I decided to give up on it... I think it's because the entire directive is a closure. I spent hours and hours, unable to figure out why I couldn't save cloudCount...
        scope.spawnClouds = function ( number ) {
          const node = document.getElementById( 'mtn-wrapper' );

            for ( var i = 0; i < number; i++ ) {
              var aCoords = randomMinMax( -1, 11 );
              var x = aCoords;
              var y = randomMinMax( 5, findY( aCoords ) );
              const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
              var cloudZ = ( Math.round( ( newZ / 10 ) - 16 ) );
              console.log( 'cloudZ: ', cloudZ );

              var cl1 = document.createElement( 'i' );
              let cl1rId = ( 'newCloud' + cloudCount );
              // let tmpLeft = 'calc(', (- 142), 'px', (- 50), 'vw)';
              // let tmpLeft = 'calc( - 142px - 50vw );';

              let cl1r = function (id) {
                var tmp = ( 'newCloud' + id );
                document.getElementById( tmp );
              }


              console.log( 'cloudCount: ' + cloudCount );
              cl1.className = 'cloud';
              cl1.id = ( cl1rId );
              console.log( 'cl1rId: ', cl1rId );
              console.log( cl1r(cloudCount ) );
              // cl1r.style.zIndex = ( cloudZ );
              cl1.style.zIndex = ( cloudZ );
              cl1.style.left = ( -42 ) + 'em';
              cl1.style.top = ( aCoords ) + 'em';
              console.log(y);
              node.appendChild( cl1 );
              cloudCount++;
            }
          } // end spawnClouds


        //////////////////////////////
        // <------- Trees --------> //
        //////////////////////////////

        // spawns a given number of randomly located, randomly colored trees.
        scope.spawnTrees = function ( number ) {
          for ( var i = 0; i < number; i++ ) {

            // determines where on the screen a tree will spawn
            const aCoords = randomMinMax( -5, 35 );
            const x = aCoords + 0.25;
            const y = ( randomMinMax( 2, findY( aCoords ) ) + 0.2 );

            // z-index of each tree and tree portion based on verticle location on screen.
            const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
            const trunkZ = newZ - 1;

            // randomizes tree color within a specific range. depending on the time of day and side of mountain...
            let gMin = 70;
            let gMax = 180;

            // left side spawns lighter trees in the morning, until afternoon.
            // right side spawns lighter trees in the afternoon until dusk.
            // only darker trees spawn after nightfall.
            if ( ( localHours > 6 && localHours < 17 && x > 15 ) || ( localHours > 9 && localHours < 17 && x < 15 ) || ( localHours > 20 || localHours < 6 ) ) {
              rMin = 50;
              rMax = 75;
              gMin = 85;
              gMax = 120;
              bMin = 50;
              bMax = 80;
              // console.log( 'localHours: ' + localHours );
              // console.log( 'x: ' + x );
              // console.log( 'y: ' + y );
            }

            const newGrn = randomClr( 60, 90, gMin, gMax, 60, 90 );

            // create DOM elements for portions of one tree
            var i1 = document.createElement( 'i' );
            var i2 = document.createElement( 'i' );
            var i3 = document.createElement( 'i' );
            var i4 = document.createElement( 'i' );

            // style the tree elements that make up one tree
            // tree top \\
            i1.className = 'treeParts';
            i1.style.zIndex = ( newZ );
            i1.style.border = '0.39em solid transparent';
            i1.style.borderBottom = '0.39em solid ' + newGrn;
            i1.style.left = ( x - 16.2 ) + 'em';
            i1.style.bottom = ( y - 23.9 ) + 'em';

            // mid branches \\
            i2.className = 'treeParts';
            i2.style.zIndex = ( newZ );
            i2.style.border = '0.55em solid transparent';
            i2.style.borderBottom = '0.55em solid ' + newGrn;
            i2.style.left = ( x - 16.4 ) + 'em';
            i2.style.bottom = ( y - 24.25 ) + 'em';

            // base branches \\
            i3.className = 'treeParts';
            i3.style.zIndex = ( newZ );
            i3.style.border = '0.55em solid transparent';
            i3.style.borderBottom = '0.75em solid ' + newGrn;
            i3.style.left = ( x - 16.4 ) + 'em';
            i3.style.bottom = ( y - 24.7 ) + 'em';

            // trunk bottom \\
            i4.className = 'treeParts';
            i4.style.zIndex = ( trunkZ );
            i4.style.border = 'none';
            i4.style.width = '.15em';
            i4.style.height = '0.31em';
            i4.style.marginBottom = '0em';
            i4.style.backgroundColor = '#522200';
            i4.style.left = ( x - 16 ) + 'em';
            i4.style.bottom = ( y - 25 ) + 'em';

            // spawn the actual tree pieces that make up one tree
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
            // determines location of rocks
            var aCoords = randomMinMax( -3, 33 );
            var x = aCoords;
            var y = ( randomMinMax( 4, findY( aCoords ) ) - 0.5 );

            // z-index based on verticle position on screen.
            const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
            var rockZ = ( newZ - 10 );
            const newGryConst = function () {
              // console.log( 'inside newGryConst: ' + ( Math.floor( Math.random() * 100 ) + 75 ) );
              return ( Math.floor( Math.random() * 100 ) + 75 );
            }

            // randomize rock color, within a specified color range.
            let newGrlet = newGryConst();
            var newGrey = randomClr( newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ) );
            // console.log( 'newGrey: ' + newGrey );

            // create DOM element for portions of a rock
            var r1 = document.createElement( 'i' );

            // style the rock
            // top of rock
            r1.style.zIndex = ( rockZ );
            r1.style.border = '0.39em solid transparent';
            r1.style.borderBottom = '0.39em solid ' + newGrey;
            r1.style.left = ( x - 16 ) + 'em';
            r1.style.bottom = ( y - 23.9 ) + 'em';

            // spawn the actual rock pieces that make up one rock
            node.appendChild( r1 );


          }
        }




        //////////////////////////////////
        //  <------ Snow Peak ------> //
        //////////////////////////////////
        scope.spawnSnowPeak = function ( number ) {
          for ( var i = 0; i < number; i++ ) {

            // determines location of elements on a triangular plane.
            var aCoords = randomMinMax( -3, 33 );
            var x = aCoords;
            var y = randomMinMax( 5, findY( aCoords ) );


            // determines z-index of DOM elements to be created later.
            const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
            var snowZ = ( newZ + 4 );

            // creates DOM elements to be worked upon
            var s1 = document.createElement( 'i' );
            var s2 = document.createElement( 'i' );
            var s3 = document.createElement( 'i' );
            var s4 = document.createElement( 'i' );
            var s5 = document.createElement( 'i' );
            var s6 = document.createElement( 'i' );
            var s7 = document.createElement( 'i' );

            // style the newly created DOM elements.
            // top
            s1.style.zIndex = ( snowZ );
            s1.style.borderWidth = '1.5em';
            s1.style.borderStyle = 'solid'
            s1.style.borderColor = 'transparent transparent rgb(246,246,246)';
            s1.style.left = ( -1.5 ) + 'em';
            s1.style.bottom = ( -1.44 ) + 'em';
            s1.style.borderRadius = '0.3em';

            // left
            s2.style.zIndex = ( snowZ );
            s2.style.borderWidth = '1.2em';
            s2.style.borderStyle = 'solid'
            s2.style.borderColor = 'transparent rgb(246,246,246) transparent transparent';
            s2.style.left = ( -3.7 ) + 'em';
            s2.style.bottom = ( -3.63 ) + 'em';
            s2.style.borderRadius = '0.3em';

            // right
            s3.style.zIndex = ( snowZ );
            s3.style.borderWidth = '1.2em';
            s3.style.borderStyle = 'solid'
            s3.style.borderColor = 'transparent transparent transparent rgb(246,246,246)';
            s3.style.left = ( 1.2 ) + 'em';
            s3.style.bottom = ( -3.51 ) + 'em';
            s3.style.borderRadius = '0.3em';

            // center
            s4.style.zIndex = ( snowZ );
            s4.style.height = ( 1.3 ) + 'em';
            s4.style.width = ( 2.65 ) + 'em';
            s4.style.backgroundColor = 'rgb(246,246,246)';
            s4.style.left = ( -1.4 ) + 'em';
            s4.style.bottom = ( -2.65 ) + 'em';

            // middle-left
            s5.style.zIndex = ( snowZ );
            s5.style.borderWidth = '0.6em';
            s5.style.borderStyle = 'solid'
            s5.style.borderColor = ' transparent transparent transparent rgb(246,246,246)';
            s5.style.left = ( -1.4 ) + 'em';
            s5.style.bottom = ( -3.55 ) + 'em';

            // middle-center
            s6.style.zIndex = ( snowZ );
            s6.style.borderWidth = '1em';
            s6.style.borderStyle = 'solid'
            s6.style.borderColor = 'rgb(246,246,246) transparent transparent transparent';
            s6.style.left = ( -1.45 ) + 'em';
            s6.style.bottom = ( -4.4 ) + 'em';

            // middle-right
            s7.style.zIndex = ( snowZ );
            s7.style.borderWidth = '0.9em';
            s7.style.borderStyle = 'solid'
            s7.style.borderColor = 'transparent rgb(246,246,246) transparent transparent';
            s7.style.left = ( -0.5 ) + 'em';
            s7.style.bottom = ( -3.48 ) + 'em';

            // append DOM elements to the previously existing DOM element, declared earlier.
            node.appendChild( s1 );
            node.appendChild( s2 );
            node.appendChild( s3 );
            node.appendChild( s4 );
            node.appendChild( s5 );
            node.appendChild( s6 );
            node.appendChild( s7 );
          }
        }



        //////////////////////////////////
        //  <-------- closing --------> //
        //////////////////////////////////

      }
    }
    return dirDefinition;
  } ) // end mountainDirective

angular.module( "myApp" ).service( "mountainSvc", function () {

  // I needed a forEach method that works nicely with nodelists
  var myForEach = function ( array, callback, scope ) {
    for ( var i = 0; i < array.length; i++ ) {
      callback.call( scope, i, array[ i ] );
    }
  };

} );

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
