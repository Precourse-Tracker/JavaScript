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
    templateUrl: './html/home/homeTemplate.html',
    controller: ["$scope", "loginService", "lessonsContentService", function($scope, loginService, lessonsContentService) {
      let currentUser = loginService.getProfile();
      currentUser.then(function(response) {
        lessonsContentService.setCurrentUserId(response.data._id);
      });
    }]
  })
  .state('lessons', {
    url: '/lessons',
    templateUrl: './html/lessons/lessonsTemplate.html',
    controller: 'lessonsController'
  })
  .state('lessonTests', {
    url: '/lessonTests',
    templateUrl: './html/lessonTests/lessonTestsTemplate.html'
    // controller: 'lessonsContentController'
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

.controller('lessonsController', ["$scope", function($scope) {

  

}])  // end lessonsController

angular.module('myApp')

.directive('lessonsSideBarDirective', ["$state", "$http", "$q", "lessonsContentService", function($state, $http, $q, lessonsContentService) {

  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsSideBarTemplate.html',
    link: function(scope, ele, attr) {
      $('.lesson-title').click(function() {
        let that = this;
        
        if ($state.name !== 'lessons') {
          $state.go('lessons')
        }
        $('.lesson-sections', that.parentNode).toggle('expand');
        $('.lesson-tests-wrapper').css('display', 'none');
      })

      let testNavigation = () => {
        $('.lesson-tests-wrapper').css('display', 'block');
        $('html, body').animate({ scrollTop: 0 }, 300);
      }

      $('.lesson-test').click(function() {
        let lessonId = lessonsContentService.getTempId();
        if ($state.name !== 'lessonTests') {
          $state.go('lessonTests');
          setTimeout(() => {
            testNavigation();
          }, 100);
        } else {
          testNavigation();
        }
      }) // end lesson-test click

    } // end of directive link
  }

}])  // end lessonsSideBarDirective

angular.module('myApp')

.controller('lessonsContentController', ["$scope", "lessonsContentService", function($scope, lessonsContentService) {
  $scope.userAnswerArray = [];
  $scope.lessonInfo = (input) => {
    lessonsContentService.setTempId(input);
    lessonsContentService.resetArray();
    $scope.lessonContent = lessonsContentService.getLessonInfo(input).then(function(lesson) {
      $scope.testObject = lesson.data[0];
      $scope.title = $scope.testObject.name;
      lessonsContentService.setLessonName($scope.theTitle);
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
      lessonsContentService.updateProgress(score);
      $scope.userAnswerArray = [];
      $('.final-score').css({
        'display': 'flex',
        'flex-direction': 'column'
      });
    }
    else {
      alert('Please answer all questions before submitting');
    }
    $('html, body').animate({ scrollTop: 0 }, 300);
  }
  $scope.resetTest = () => {
    $scope.userAnswerArray = [];
    $('html, body').animate({ scrollTop: 0 }, 300);
    $('.quiz-button').css({
      "background-color": "#ebebeb",
      "color": "#406BB2"
    })
  }
  //////testing buttton click////
  $scope.answerClicked = ($event) => {
    let temp = $event.currentTarget.parentNode;
    $(temp).children('button').css({
      "background-color": "#ebebeb",
      "color": "#406BB2"
    })
    $($event.currentTarget).css({
      "background-color": "#8FB9FF",
      "color": "#fff",
      "outline": 0
    });
  }
}]) // end lessonsContentController

angular.module('myApp')

.directive('lessonsContentDirective', ["lessonsContentService", function(lessonsContentService) {
  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsContentTemplate.html',
    scope: {
      title: '=',
      testObject: '=',
      testScore: '='
    },
    link: function(scope, ele, attr) {
      let lessonId = lessonsContentService.getTempId();
      scope.lessonContent = lessonsContentService.getLessonInfo(lessonId).then(function(lesson) {
        scope.testObject = lesson.data[0];
        scope.title = scope.testObject.name;
        lessonsContentService.setLessonName(scope.theTitle);
        scope.testIndex = scope.testObject.questions.forEach(function(entry, index){
            entry.index = index;
            lessonsContentService.setCorrectAnswer(entry.correctAnswer, index);
        })
      })
    }
  }
}]) // end lessonsContentDirective

angular.module('myApp')

.service('lessonsContentService', ["$http", "loginService", function($http, loginService) {
  let correctAnswerArray = [];
  let lessonName = '';
  let currentUserId = '';
  let tempId = ''; // var for moving from lessons to lessontests
  let clickedTopic = '';
  this.setTempId = (input) => {  // set parameter to get when moving from lessons to lessontests
    tempId = input;
  }
  this.setClickedTopic = (input) => {
    clickedTopic = input;
  }
  this.setCurrentUserId = (userId) => {
    currentUserId = userId;
  }
  this.setLessonName = (input) => {
    lessonName = input;
  }
  this.setCorrectAnswer = (input, index) => {
    correctAnswerArray[index] = input;
  }
  this.getTempId = () => {  // get when moving from lessons to lessontests
    return tempId;
  }
  this.getClickedTopic = () => {
    return clickedTopic;
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
  this.updateProgress = (score) => {
    return $http ({
      method: 'PUT',
      url: '/api/lessons/progress',
      data: {score, lessonName, currentUserId}
    })
  }
}])  // end lessonsContentService

angular.module('myApp')

.controller('lessonTestsController', ["$scope", function($scope) {



}])  // end lessonTestsController

angular.module('myApp')

.directive('lessonTestsDirective', function() {

  return {
    restrict: 'A',
    link: function(scope, ele, attr) {
      $('.reset-test').click(function() {
        $('.final-score').css('display', 'none');
      })
      $('.lessons').click(function(){
        $('.final-score').css('display', 'none');
      })
    }
  }

})  // end lessonTestsDirective


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
  .controller( 'mountainController', [ '$scope', 'loginService', 'mountainSvc', function ( $scope, loginService, mountainSvc ) {


    $scope.logoutUser = function () {
      loginService.logoutUser();
    };

    $scope.getUser = function ( id ) {
      mountainSvc.getUser( id )
        .then( function ( response ) {
          console.log(response);

          $scope.user = response.data
          console.log($scope.user[0]);
        } )
    }
    console.log($scope.getUser('57150955710833b8272b9b2f'));
    console.log($scope.user);
    // let user = getUser();
    // let progress = user.progress;
    // console.log(user);
    // console.log(progress);

} ] );

angular.module( 'myApp' ).directive( 'mountainDirective', ["mountainSvc", function ( mountainSvc ) {
    var dirDefinition = {
      restrict: 'E',
      templateUrl: './html/mountain/mountainTemplate.html',
      controller: 'mountainController',
      link: function ( scope, element, attrs, controller, transcludeFn, animate, mountainSvc ) {
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


        //-------//////////////////////////-------//
        //------- <------ The DOM -------> -------//
        //-------//////////////////////////-------//


        // determines which DOM element to append created elements.
        var node = document.getElementById( 'mountainScene-right' );
        let mSLeft = document.getElementById( 'mountainScene-left' );
        let mSRight = document.getElementById( 'mountainScene-right' );
        let bgmLeft = document.getElementById( 'bgMountain-Left' );
        let bgmRight = document.getElementById( 'bgMountain-right' );
        let bgDirt = document.getElementById( 'bigDirt' );
        var sk1 = document.createElement( 'i' );
        var gr1 = document.createElement( 'i' );


        //////////////////////////////
        // <----- Time of Day ----> //
        ////////////////////////// ////
        // handles most time related styling changes
        // retrieves users time
        let dt = new Date();
        let tz = dt.getTimezoneOffset();
        let localHours = dt.getHours();
        let sliderVal = localHours;


        // TODO:
        var slidePos = document.getElementById( 'sliderSun' ).value;

        // simulates the passage of time.
        timePassing = function ( newValue ) {
          document.getElementById( "range" ).innerHTML = newValue;
          slidePos = newValue;
          localHours = newValue;
          sliderVal = newValue;

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
          bgDirt.style.boxShadow = ( bgDirt.style.borderColor + '13em -3.4em 1px -2.75em' );
          sk1.style.backgroundColor = daylight( slidePos, sk1.rgbColor );
          gr1.style.backgroundColor = daylight( slidePos, gr1.rgbColor );
          return sliderVal;
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

            // TODO: distant horizon
            // TODO: moon
            // TODO: stars

            node.appendChild( sk1 );
            node.appendChild( gr1 );

            scope.add = ( function () {
              var counter = 0;
              return function () {
                return counter += 1;

              }
            } )();
          } // end background


        //////////////////////////////////
        //  <--------- clouds --------> //
        //////////////////////////////////
        let cloudCount = 1;
        scope.spawnClouds = function ( number ) {
            const node = document.getElementById( 'mtn-wrapper' );

            for ( var i = 0; i < number; i++ ) {
              var aCoords = randomMinMax( -1, 11 );
              var x = aCoords;
              var y = randomMinMax( 5, findY( aCoords ) );
              const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
              var cloudZ = ( Math.round( ( newZ / 10 ) - 16 ) );

              var cl1 = document.createElement( 'i' );
              let cl1rId = ( 'newCloud' + cloudCount );
              // let tmpLeft = 'calc(', (- 142), 'px', (- 50), 'vw)';
              // let tmpLeft = 'calc( - 142px - 50vw );';

              let cl1r = function ( id ) {
                var tmp = ( 'newCloud' + id );
                document.getElementById( tmp );
              }

              cl1.className = 'cloud';
              cl1.id = ( cl1rId );
              // cl1r.style.zIndex = ( cloudZ );
              cl1.style.zIndex = ( cloudZ );
              cl1.style.left = ( -42 ) + 'em';
              cl1.style.top = ( aCoords ) + 'em';
              cl1.style.animationDuration = ( ( randomMinMax( 30, 60 ) ) + 's' );

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

            // left/North side spawns darker trees in the afternoon, until sunrise.
            // right/South side spawns darker trees in the evening until mid-day.
            // only darker trees spawn after nightfall.

            // left dark, right dark,
            localHours = sliderVal;
            if ( ( ( localHours < 6 || localHours >= 15 ) && x < 15 ) || ( ( localHours < 9 || localHours >= 20 ) && x > 15 ) ) {
              rMin = 50;
              rMax = 75;
              gMin = 85;
              gMax = 120;
              bMin = 50;
              bMax = 80;
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
        scope.spawnClimber = function ( number ) {
          // determines location of climber
          let aCoords = randomMinMax( -3, 33 );
          let x = aCoords;
          let y = ( randomMinMax( 4, findY( aCoords ) ) - 0.5 );

          // z-index based on vertical position on screen.
          const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
          var climberZ = ( newZ + 20 );

          // create DOM element for portions of a climber
          var clmbr1 = document.createElement( 'i' );

          // get progress, define position on mountain


          // style the climber
          clmbr1.style.zIndex = ( climberZ );
          clmbr1.style.width = '50px';
          clmbr1.style.height = '50px';
          clmbr1.style.backgroundColor = 'red';
          clmbr1.style.border = '0.39em solid transparent';
          clmbr1.style.borderBottom = '0.39em solid ' + 'red';

          // position
          clmbr1.style.left = ( x - 16 ) + 'em';
          clmbr1.style.bottom = ( y - 23.9 ) + 'em';

          // spawn the actual climber pieces that make up one climber
          node.appendChild( clmbr1 );
        }

        /*
        progress.lessons = [ {lesson obj1: name, score}, ]
        */

        /*
                scope.advanceClimber = function(){

                  // move the climber based on progress
                  const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
                  var climberZ = ( newZ + 20 );
                  var clmbr1 = document.createElement( 'i' );
                  clmbr1.style.width = '50px';
                  clmbr1.style.height = '50px';
                  node.appendChild( clmbr1 );
                }
         */

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

            // z-index based on vertical position on screen.
            const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
            var rockZ = ( newZ - 10 );
            const newGryConst = function () {
              return ( Math.floor( Math.random() * 100 ) + 75 );
            }

            // randomize rock color, within a specified color range.
            let newGrlet = newGryConst();
            var newGrey = randomClr( newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ), newGrlet, ( newGrlet + randomMinMax( 1, 20 ) ) );

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
            let node = document.getElementById( 'mountainScene-right' );
            // determines location of elements on a triangular plane.
            var aCoords = randomMinMax( -3, 33 );
            var x = aCoords;
            var y = randomMinMax( 5, findY( aCoords ) );


            // determines z-index of DOM elements to be created later.
            const newZ = ( 220 + ( Math.floor( Math.floor( 10 - ( 100 * y ) ) / 10 ) ) );
            var snowZ = ( newZ + 4 );

            // creates DOM elements to be worked upon
            // front mountain
            var s1 = document.createElement( 'i' );
            var s1a = document.createElement( 'i' );
            var s2 = document.createElement( 'i' );
            var s3 = document.createElement( 'i' );
            var s4 = document.createElement( 'i' );
            var s4a = document.createElement( 'i' );
            var s4b = document.createElement( 'i' );
            var s4c = document.createElement( 'i' );
            var s5 = document.createElement( 'i' );
            var s6 = document.createElement( 'i' );
            var s7 = document.createElement( 'i' );

            // back mountain
            var sbm1 = document.createElement( 'i' );
            var sbm2 = document.createElement( 'i' );
            var sbm3 = document.createElement( 'i' );
            var sbm4 = document.createElement( 'i' );

            // style the newly created DOM elements.
            // top-left
            s1.style.zIndex = ( snowZ );
            s1.style.borderWidth = '1.5em';
            s1.style.borderStyle = 'solid'
            s1.style.borderColor = 'transparent rgb(234,234,234) transparent transparent';
            s1.style.left = ( -2.9 ) + 'em';
            s1.style.bottom = ( -2.9 ) + 'em';
            s1.style.borderRadius = '0.3em';

            // top-right
            s1a.style.zIndex = ( snowZ );
            s1a.style.borderWidth = '1.5em';
            s1a.style.borderStyle = 'solid'
            s1a.style.borderColor = 'transparent transparent transparent rgb(246,246,246)';
            s1a.style.left = ( -0.1 ) + 'em';
            s1a.style.bottom = ( -2.9 ) + 'em';
            s1a.style.borderRadius = '0.3em';

            // left
            s2.style.zIndex = ( snowZ );
            s2.style.borderWidth = '1.2em';
            s2.style.borderStyle = 'solid'
            s2.style.borderColor = 'transparent rgb(234,234,234) transparent transparent';
            s2.style.left = ( -3.7 ) + 'em';
            s2.style.bottom = ( -3.69 ) + 'em';
            s2.style.borderRadius = '0.3em';

            // right
            s3.style.zIndex = ( snowZ );
            s3.style.borderWidth = '1.2em';
            s3.style.borderStyle = 'solid'
            s3.style.borderColor = 'transparent transparent transparent rgb(246,246,246)';
            s3.style.left = ( 1.2 ) + 'em';
            s3.style.bottom = ( -3.59 ) + 'em';
            s3.style.borderRadius = '0.3em';

            // center - mrectangle
            s4.style.zIndex = ( snowZ - 10 );
            s4.style.height = ( 1.3 ) + 'em';
            s4.style.width = ( 1.5 ) + 'em';
            s4.style.backgroundColor = 'rgb(246,246,246)';
            s4.style.left = ( -0.1 ) + 'em';
            s4.style.bottom = ( -2.65 ) + 'em';

            // s4a filter color on // center
            s4a.style.zIndex = ( snowZ + 1 );
            s4a.style.borderWidth = '1.2em';
            s4a.style.borderStyle = 'solid'
            s4a.style.borderColor = 'transparent rgb(234,234,234) transparent transparent';
            s4a.style.left = ( -2.7 ) + 'em';
            s4a.style.bottom = ( -3.5 ) + 'em';
            s4a.style.borderRadius = '0.3em';

            s4b.style.zIndex = ( snowZ );
            s4b.style.borderWidth = '1.2em';
            s4b.style.borderStyle = 'solid'
            s4b.style.borderColor = 'transparent rgb(234,234,234) transparent transparent';
            s4b.style.left = ( -3.7 ) + 'em';
            s4b.style.bottom = ( -3.67 ) + 'em';
            s4b.style.borderRadius = '0.3em';

            s4c.style.zIndex = ( snowZ - 10 );
            s4c.style.height = ( 1.3 ) + 'em';
            s4c.style.width = ( 0.65 ) + 'em';
            s4c.style.backgroundColor = 'rgb(234,234,234)';
            s4c.style.left = ( -1.4 ) + 'em';
            s4c.style.bottom = ( -2.65 ) + 'em';



            // middle-left
            s5.style.zIndex = ( snowZ );
            s5.style.borderWidth = '0.6em';
            s5.style.borderStyle = 'solid'
            s5.style.borderColor = ' transparent transparent transparent rgb(234,234,234)';
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
            node.appendChild( s1a );
            node.appendChild( s2 );
            node.appendChild( s3 );
            node.appendChild( s4 );
            node.appendChild( s4a );
            node.appendChild( s4b );
            node.appendChild( s4c );
            node.appendChild( s5 );
            node.appendChild( s6 );
            node.appendChild( s7 );
            //------------------------\\
            //---- Background Mtn ----\\
            //--------  Snow  --------\\
            node = document.getElementById( 'bgMountain-right' );
            // top
            sbm1.style.zIndex = ( snowZ );
            sbm1.style.borderWidth = '1.6em';
            sbm1.style.borderStyle = 'solid'
            sbm1.style.borderColor = 'transparent transparent rgb(246,246,246)';
            sbm1.style.left = ( -1.58 ) + 'em';
            sbm1.style.bottom = ( -1.4 ) + 'em';
            sbm1.style.borderRadius = '0.3em';

            // left
            sbm2.style.zIndex = ( snowZ );
            sbm2.style.borderWidth = '1.6em';
            sbm2.style.borderStyle = 'solid'
            sbm2.style.borderColor = 'transparent rgb(234,234,234) transparent transparent';
            sbm2.style.left = ( -3.2 ) + 'em';
            sbm2.style.bottom = ( -3 ) + 'em';
            sbm2.style.borderRadius = '0.3em';

            // right
            sbm3.style.zIndex = ( snowZ );
            sbm3.style.borderWidth = '1.3em';
            sbm3.style.borderStyle = 'solid'
            sbm3.style.borderColor = 'transparent transparent transparent rgb(246,246,246)';
            sbm3.style.left = ( -0.1 ) + 'em';
            sbm3.style.bottom = ( -2.4 ) + 'em';
            sbm3.style.borderRadius = '0.3em';





            node.appendChild( sbm1 );
            node.appendChild( sbm2 );
            node.appendChild( sbm3 );
          }
        }



        //////////////////////////////////
        //  <-------- closing --------> //
        //////////////////////////////////

      }
    }
    return dirDefinition;
  }] ) // end mountainDirective

angular.module( "myApp" ).service( "mountainSvc", ["$http", function ($http) {



  this.getUser = function (id) {
    console.log( id );
    return $http( {
        method: 'GET',
        url: '/api/users/?_id=' + id
      } )
      .then( function ( response ) {
        return response
      } );
  };


}] );

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
