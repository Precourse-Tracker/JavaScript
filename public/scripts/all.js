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

.controller('lessonTestsController', ["$scope", function($scope) {

  // $scope.test = 'test on ctrl';
  // $scope.blob = 'blob on ctrl';



}])  // end lessonTestsController

angular.module('myApp')

.directive('lessonTestsDirective', function() {


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

.directive('lessonsSideBarDirective', ["$state", function($state) {

  return {
    restrict: 'E',
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
          switch (temp) {
            case 'js-lesson-data-types':
              $('.js-lesson-data-types').css('z-index', 2);
              $('.js-lesson-data-types').siblings().css('z-index', 0);
              break;
            case 'js-lesson-variables':
              $('.js-lesson-variables').css('z-index', 2);
              $('.js-lesson-variables').siblings().css('z-index', 0);
              break;
            case 'js-lesson-strings-cont':
              $('.js-lesson-strings-cont').css('z-index', 2);
              $('.js-lesson-strings-cont').siblings().css('z-index', 0);
              break;
            case 'js-lesson-conditional':
              $('.js-lesson-conditional').css('z-index', 2);
              $('.js-lesson-conditional').siblings().css('z-index', 0);
              break;
            case 'js-lesson-arrays':
              $('.js-lesson-arrays').css('z-index', 2);
              $('.js-lesson-arrays').siblings().css('z-index', 0);
              break;
            case 'js-lesson-objects':
              $('.js-lesson-objects').css('z-index', 2);
              $('.js-lesson-objects').siblings().css('z-index', 0);
              break;
            case 'js-lesson-iterators':
              $('.js-lesson-iterators').css('z-index', 2);
              $('.js-lesson-iterators').siblings().css('z-index', 0);
              break;
            case 'js-lesson-logical':
              $('.js-lesson-logical').css('z-index', 2);
              $('.js-lesson-logical').siblings().css('z-index', 0);
              break;
            case 'js-lesson-functions':
              $('.js-lesson-functions').css('z-index', 2);
              $('.js-lesson-functions').siblings().css('z-index', 0);
              break;
            default:
              break;
          }
        } // end testNavigation

        $('html, body').animate({ scrollTop: 0 }, 300);
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
