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

   .directive('bars', function () {
      return {
         restrict: 'EA',
         replace: true,
         template: '<div id="main"></div>',
         link: function (scope, element, attrs) {
     /////////////////////////////////////////////////////////
     /////////////// The Radar Chart Function ////////////////
     /////////////////////////////////////////////////////////
     var color = d3.scale.ordinal()
       .range(["#EDC951"]);

     var radarChartOptions = {
       w: width,
       h: height,
       margin: margin,
       maxValue: 0.5,
       levels: 4,
       roundStrokes: true,
       color: color
     };

     var margin = {top: 100, right: 100, bottom: 100, left: 100},
       width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
       height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
     var data = [
           [// JS Unit Lesson Tests
           {axis:"Data Types",value:0.5},
           {axis:"Variables",value:1},
           {axis:"Strings",value:0.87},
           {axis:"Arrays",value:0.85},
           {axis:"Objects",value:0.52},
           {axis:"Iterators",value:0.90},
           {axis:"Logical Operators",value:0.41},
           {axis:"Functions",value:0.80}
           ]
         ];
     function RadarChart(id, data, options) {
     	var chart = {
     	 w: 350,				//Width of the circle
     	 h: 350,				//Height of the circle
     	 margin: {top: 100, right: 100, bottom: 100, left: 100}, //The margins of the SVG
     	 levels: 3,				//How many levels or inner circles should there be drawn
     	 maxValue: 100, 			//What is the value that the biggest circle will represent
     	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
     	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
     	 opacityArea: 0.35, 	//The opacity of the area of the blob
     	 dotRadius: 4, 			//The size of the colored circles of each blog
     	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
     	 strokeWidth: 2, 		//The width of the stroke around each blob
     	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
     	 color: d3.scale.category10()	//Color function
     	};


     	//Put all of the options into a variable called chart
     	if('undefined' !== typeof options){
     	  for(var i in options){
     		if('undefined' !== typeof options[i]){ chart[i] = options[i]; }
     	  }//for i
     	}//if

     	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
     	var maxValue = Math.max(chart.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

     	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
     		total = allAxis.length,					//The number of different axes
     		radius = Math.min(chart.w/2, chart.h/2), 	//Radius of the outermost circle
     		Format = d3.format('%'),			 	//Percentage formatting
     		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

     	//Scale for the radius
     	var rScale = d3.scale.linear()
     		.range([0, radius])
     		.domain([0, maxValue]);

     	/////////////////////////////////////////////////////////
     	//////////// Create the container SVG and g /////////////
     	/////////////////////////////////////////////////////////

     	//Remove whatever chart with the same id/class was present before
     	d3.select(id).select("svg").remove();

     	//Initiate the radar chart SVG
     	var svg = d3.select(id).append("svg")
     			.attr("width",  chart.w + chart.margin.left + chart.margin.right)
     			.attr("height", chart.h + chart.margin.top + chart.margin.bottom)
     			.attr("class", "radar"+id);
     	//Append a g element
     	var g = svg.append("g")
     			.attr("transform", "translate(" + (chart.w/2 + chart.margin.left) + "," + (chart.h/2 + chart.margin.top) + ")");

     	/////////////////////////////////////////////////////////
     	////////// Glow filter for some extra pizzazz ///////////
     	/////////////////////////////////////////////////////////

     	//Filter for the outside glow
     	var filter = g.append('defs').append('filter').attr('id','glow'),
     		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
     		feMerge = filter.append('feMerge'),
     		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
     		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

     	/////////////////////////////////////////////////////////
     	/////////////// Draw the Circular grid //////////////////
     	/////////////////////////////////////////////////////////







     	//Wrapper for the grid & axes
     	var axisGrid = g.append("g").attr("class", "axisWrapper");

     	//Draw the background circles
     	axisGrid.selectAll(".levels")
     	   .data(d3.range(1,(chart.levels+1)).reverse())
     	   .enter()
     		.append("circle")
     		.attr("class", "gridCircle")
     		.attr("r", function(d, i){return radius/chart.levels*d;})
     		.style("fill", "#CDCDCD")
     		.style("stroke", "#CDCDCD")
     		.style("fill-opacity", chart.opacityCircles)
     		.style("filter" , "url(#glow)");

     	//Text indicating at what % each level is
     	axisGrid.selectAll(".axisLabel")
     	   .data(d3.range(1,(chart.levels+1)).reverse())
     	   .enter().append("text")
     	   .attr("class", "axisLabel")
     	   .attr("x", 4)
     	   .attr("y", function(d){return -d*radius/chart.levels;})
     	   .attr("dy", "0.4em")
     	   .style("font-size", "10px")
     	   .attr("fill", "#737373")
     	   .text(function(d,i) { return Format(maxValue * d/chart.levels); });

     	/////////////////////////////////////////////////////////
     	//////////////////// Draw the axes //////////////////////
     	/////////////////////////////////////////////////////////

     	//Create the straight lines radiating outward from the center
     	var axis = axisGrid.selectAll(".axis")
     		.data(allAxis)
     		.enter()
     		.append("g")
     		.attr("class", "axis");
     	//Append the lines
     	axis.append("line")
     		.attr("x1", 0)
     		.attr("y1", 0)
     		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
     		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
     		.attr("class", "line")
     		.style("stroke", "white")
     		.style("stroke-width", "2px");

     	//Append the labels at each axis
     	axis.append("text")
     		.attr("class", "legend")
     		.style("font-size", "11px")
     		.attr("text-anchor", "middle")
     		.attr("dy", "0.35em")
     		.attr("x", function(d, i){ return rScale(maxValue * chart.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
     		.attr("y", function(d, i){ return rScale(maxValue * chart.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
     		.text(function(d){return d})
     		.call(wrap, chart.wrapWidth);

     	/////////////////////////////////////////////////////////
     	///////////// Draw the radar chart blobs ////////////////
     	/////////////////////////////////////////////////////////

     	//The radial line function
     	var radarLine = d3.svg.line.radial()
     		.interpolate("linear-closed")
     		.radius(function(d) { return rScale(d.value); })
     		.angle(function(d,i) {	return i*angleSlice; });

     	if(chart.roundStrokes) {
     		radarLine.interpolate("cardinal-closed");
     	}

     	//Create a wrapper for the blobs
     	var blobWrapper = g.selectAll(".radarWrapper")
     		.data(data)
     		.enter().append("g")
     		.attr("class", "radarWrapper");

     	//Append the backgrounds
     	blobWrapper
     		.append("path")
     		.attr("class", "radarArea")
     		.attr("d", function(d,i) { return radarLine(d); })
     		.style("fill", function(d,i) { return chart.color(i); })
     		.style("fill-opacity", chart.opacityArea)
     		.on('mouseover', function (d,i){
     			//Dim all blobs
     			d3.selectAll(".radarArea")
     				.transition().duration(200)
     				.style("fill-opacity", 0.1);
     			//Bring back the hovered over blob
     			d3.select(this)
     				.transition().duration(200)
     				.style("fill-opacity", 0.6);
     		})
     		.on('mouseout', function(){
     			//Bring back all blobs
     			d3.selectAll(".radarArea")
     				.transition().duration(200)
     				.style("fill-opacity", chart.opacityArea);
     		});

     	//Create the outlines
     	blobWrapper.append("path")
     		.attr("class", "radarStroke")
     		.attr("d", function(d,i) { return radarLine(d); })
     		.style("stroke-width", chart.strokeWidth + "px")
     		.style("stroke", function(d,i) { return chart.color(i); })
     		.style("fill", "none")
     		.style("filter" , "url(#glow)");

     	//Append the circles
     	blobWrapper.selectAll(".radarCircle")
     		.data(function(d,i) { return d; })
     		.enter().append("circle")
     		.attr("class", "radarCircle")
     		.attr("r", chart.dotRadius)
     		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
     		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
     		.style("fill", function(d,i,j) { return chart.color(j); })
     		.style("fill-opacity", 0.8);

     	/////////////////////////////////////////////////////////
     	//////// Append invisible circles for tooltip ///////////
     	/////////////////////////////////////////////////////////

     	//Wrapper for the invisible circles on top
     	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
     		.data(data)
     		.enter().append("g")
     		.attr("class", "radarCircleWrapper");

     	//Append a set of invisible circles on top for the mouseover pop-up
     	// blobCircleWrapper.selectAll(".radarInvisibleCircle")
     	// 	.data(function(d,i) { return d; })
     	// 	.enter().append("circle")
     	// 	.attr("class", "radarInvisibleCircle")
     	// 	.attr("r", chart.dotRadius*1.5)
     	// 	.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
     	// 	.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
     	// 	.style("fill", "none")
     	// 	.style("pointer-events", "all")
     	// 	.on("mouseover", function(d,i) {
     	// 		newX =  parseFloat(d3.select(this).attr('cx')) - 10;
     	// 		newY =  parseFloat(d3.select(this).attr('cy')) - 10;
       //
     	// 		tooltip
     	// 			.attr('x', newX)
     	// 			.attr('y', newY)
     	// 			.text(Format(d.value))
     	// 			.transition().duration(200)
     	// 			.style('opacity', 1);
     	// 	})
     	// 	.on("mouseout", function(){
     	// 		tooltip.transition().duration(200)
     	// 			.style("opacity", 0);
     	// 	});

     	//Set up the small tooltip for when you hover over a circle
     	// var tooltip = g.append("text")
     	// 	.attr("class", "tooltip")
     	// 	.style("opacity", 0);

     	/////////////////////////////////////////////////////////
     	/////////////////// Helper Function /////////////////////
     	/////////////////////////////////////////////////////////

     	//Taken from http://bl.ocks.org/mbostock/7555321
     	//Wraps SVG text
     	function wrap(text, width) {
     	  text.each(function() {
     		var text = d3.select(this),
     			words = text.text().split(/\s+/).reverse(),
     			word,
     			line = [],
     			lineNumber = 0,
     			lineHeight = 1.4, // ems Not sure if it's really needed
     			y = text.attr("y"),
     			x = text.attr("x"),
     			dy = parseFloat(text.attr("dy")),
     			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

     		while (word = words.pop()) {
     		  line.push(word);
     		  tspan.text(line.join(" "));
     		  if (tspan.node().getComputedTextLength() > width) {
     			line.pop();
     			tspan.text(line.join(" "));
     			line = [word];
     			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
     		  }
     		}
     	  });
     	}//wrap

     }//RadarChart
     RadarChart(".radarChart", data, radarChartOptions);

      // dont touch
         }
      };
   });

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
        tick = 0;
        console.log(resp);
      })
    }

}])

angular.module('myApp').service('workerService', ["Webworker", function(Webworker) {

  this.worker = (qId, answer, userCode) => {

    function isSame(userCode, answer) {
      var results = eval(userCode);
      if (results.toString() === answer) {
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

angular.module( 'myApp' )
  .directive( 'mountainDirective', function () {
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

        // creates a random color given a specific range
        const randomClr = function ( rdL, rdH, grL, grH, buL, buH ) {
          let rd = Math.floor( randomMinMax( rdL, rdH ) );
          let grn = Math.floor( randomMinMax( grL, grH ) );
          let bl = Math.floor( randomMinMax( buL, buH ) );
          return ( 'rgb(' + rd + ', ' + grn + ', ' + bl + ')' );
        }

        // determines which DOM element to append created elements.
        var node = document.getElementById( 'mountainScene-right' );


        // retrieves users time
        let dt = new Date();
        let tz = dt.getTimezoneOffset();
        let localHours = dt.getHours();





        //////////////////////////////
        // <----- Background -----> //
        //////////////////////////////

        scope.spawnBackground = function ( date, trouble ) {

          var node = document.getElementById( 'mtn-wrapper' );

          console.log( 'hey: ' + localHours );

          var sk1 = document.createElement( 'i' );
          var gr1 = document.createElement( 'i' );

          // sky
          sk1.style.backgroundColor = 'rgb(28, 24, 94)';
          sk1.style.zIndex = ( -50 );
          sk1.style.width = '100vw';
          sk1.style.height = '45vh';
          sk1.style.left = ( 0 ) + 'em';
          sk1.style.top = ( -2 ) + 'vh';
          sk1.style.margin = '0px';

          // ground
          gr1.style.backgroundColor = 'rgb(70, 97, 41)';
          gr1.style.zIndex = ( -50 );
          gr1.style.width = '100%';
          gr1.style.height = '55vh';
          gr1.style.left = ( 0 ) + 'em';
          gr1.style.top = ( 35 ) + 'vh';
          gr1.style.margin = '0px';

          // It's a giant switch for prototyping, later it will be much cleaner, generated by js dynamically based on minutes given, smooth transitions between sky colors.
          switch ( localHours ) {
          case 5:
            sk1.style.backgroundColor = 'rgb(28, 24, 94)';
            gr1.style.backgroundColor = 'rgb(35, 48, 20)';
            break;

          case 6:
            sk1.style.backgroundColor = 'rgb(32, 25, 145)';
            gr1.style.backgroundColor = 'rgb(41, 57, 23)';
            break;

          case 7:
            sk1.style.backgroundColor = 'rgb(27, 16, 208)';
            gr1.style.backgroundColor = 'rgb(54, 75, 31)';
            break;

          case 8:
            sk1.style.backgroundColor = 'rgb(16, 58, 208)';
            gr1.style.backgroundColor = 'rgb(70, 97, 41)';
            break;

          case 9:
            sk1.style.backgroundColor = 'rgb(16, 104, 208)';
            gr1.style.backgroundColor = 'rgb(85, 117, 50)';
            break;

          default:
            sk1.style.backgroundColor = 'rgb(16, 144, 208)';
            gr1.style.backgroundColor = 'rgb(92, 140, 40)';
            break;

          case 19:
            sk1.style.backgroundColor = 'rgb(16, 104, 208)';
            gr1.style.backgroundColor = 'rgb(85, 117, 50)';
            break;

          case 20:
            sk1.style.backgroundColor = 'rgb(16, 58, 208)';
            gr1.style.backgroundColor = 'rgb(41, 57, 23)';
            break;

          case 21:
            sk1.style.backgroundColor = 'rgb(32, 25, 145)';
            gr1.style.backgroundColor = 'rgb(35, 48, 20)';
            break;
          }

          // sun
          // moon
          // stars



          node.appendChild( sk1 );
          node.appendChild( gr1 );






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
        }

        //////////////////////////////
        // <------- Trees --------> //
        //////////////////////////////

        // spawns a given number of randomly located, randomly colored trees.
        scope.spawnTrees = function ( number ) {
          for ( var i = 0; i < number; i++ ) {

            // determines where on the screen a tree will spawn
            var aCoords = randomMinMax( -3, 33 );
            var x = aCoords;
            var y = ( randomMinMax( 5, findY( aCoords ) ) - 0.1 );

            // z-index of each tree and tree portion based on verticle location on screen.
            const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
            var trunkZ = newZ - 1;

            // randomizes tree color within a specific range. depending on the time of day and side of mountain...
            let gMin = 70;
            let gMax = 180;

            // left side spawns lighter trees in the morning, until afternoon.
            // right side spawns lighter trees in the afternoon until dusk.
            // only darker trees spawn after nightfall.
            if ( ( localHours > 6 && localHours < 17 && x > 15 ) || ( localHours > 9 && localHours < 17 && x < 15 ) || ( localHours > 21 || localHours < 6 ) ) {
              rMin = 50;
              rMax = 75;
              gMin = 85;
              gMax = 120;
              bMin = 50;
              bMax = 80;
              console.log( 'localHours: ' + localHours );
              console.log( 'x: ' + x );
              console.log( 'y: ' + y );
            }


            // both sides dark
            // 21 until 6
            // right side dark
            // 21 until 10


            const newGrn = randomClr( 60, 90, gMin, gMax, 60, 90 );

            // create DOM elements for portions of one tree
            var i1 = document.createElement( 'i' );
            var i2 = document.createElement( 'i' );
            var i3 = document.createElement( 'i' );
            var i4 = document.createElement( 'i' );

            // style the tree elements that make up one tree
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
              console.log( 'inside newGryConst: ' + ( Math.floor( Math.random() * 100 ) + 75 ) );
              return ( Math.floor( Math.random() * 100 ) + 75 );
            }

            // randomize rock color, within a specified color range.
            let newGrlet = newGryConst();
            var newGrey = randomClr( newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ) );
            console.log( 'newGrey: ' + newGrey );

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

            /* store low points in an array, new location is based on previous coords, so snow creeps down mountain. I can use the clusters on the ground as an interval to call this function, maybe every 8 clusters or something, the snow creeps further down. */

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
