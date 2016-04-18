angular.module('myApp', ['ui.router', 'ngWebworker'])

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
  console.log(qId, answer, userCode);
  workerService.worker(qId, answer, userCode);

  // let userCode = userCode;

  // jsTesting.workerTest(qId, answer, userCode);
  // function isSame(userCode, answer) {
  //   if (userCode === answer) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //
  // var myWorker = Webworker.create(isSame);
  //
  // myWorker.run(userCode, answer).then((result) => {
  //   alert(`This is ${result}`);
  // })

}
// var editor = ace.edit("editor");
// editor.setTheme("ace/theme/chrome");
// editor.getSession().setMode("ace/mode/javascript");
//
// var editor_1 = ace.edit("editor_1");
// editor_1.setTheme("ace/theme/chrome");
// editor_1.getSession().setMode("ace/mode/javascript");

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

}])

/**
 * ng-webworker - ng-webworker creates dynamic webworkers so angular apps can be multi-threaded.
 * @link https://github.com/mattslocum/ng-webworker
 * @license MIT
 */
!function (name, context, definition) {
    // CommonJS
    if (typeof module != 'undefined' && module.exports) module.exports = definition();
    // AMD
    else if (typeof define == 'function' && define.amd) define(definition);
    // <script>
    else context[name] = definition()
}('ngWebworker', this, function () {
    'use strict';

    var oWebworkerModule = angular.module('ngWebworker', []),
        CONST_FUNCTION = "function",
        CONST_RETURN = "return",
        CONST_COMPLETE = "complete",
        CONST_NOTICE = "notice";


    oWebworkerModule.provider('Webworker', function() {
        var WebworkerConfig = {
            async: false,
            helperPath: "worker_wrapper.js",
            useHelper: false, // gets set back to true for IE
            transferOwnership: true // if you pass in a ByteArray. Warning: Experimental
        };

        this.setConfig = function(oConfig) {
            angular.extend(WebworkerConfig, oConfig);
        };
        this.setHelperPath = function(strPath) {
            WebworkerConfig.helperPath = strPath;
        };
        this.setUseHelper = function(bUse) {
            WebworkerConfig.useHelper = !!bUse;
        };
        this.setTransferOwnership = function(bTransfer) {
            WebworkerConfig.transferOwnership = !!bTransfer;
        };


        function Webworker($q) {
            this.create = function(worker, config) {
                var win = window,
                    URL = win.URL || win.webkitURL,
                    aFuncParts,
                    strWorker,
                    blob,
                    retWorker;

                // only use this function inside the webworker
                function _transferable_ (messageData) {
                    var messageDataTransfers = [];

                    if (Object.prototype.toString.apply(messageData) != '[object Array]') {
                        messageData = [messageData];
                    }

                    messageData.forEach(function (data) {
                        if (data instanceof ArrayBuffer) {
                            messageDataTransfers.push(data);
                        }
                    });

                    return messageDataTransfers;
                }

                config = config || {};

                config = angular.extend(
                    angular.copy(WebworkerConfig),
                    config
                );


                // stupid IE thinks Blob Webworkers violate same-origin
                // stupid Edge thinks it's not IE
                if (navigator.userAgent.indexOf('MSIE') !== -1 ||
                    navigator.userAgent.indexOf('Edge') !== -1 ||
                    navigator.appVersion.indexOf('Trident/') > 0) {
                    config.useHelper = true;
                }

                if (Worker && URL && URL.createObjectURL && (Blob || win.BlobBuilder || win.WebKitBlobBuilder || win.MozBlobBuilder)) {
                    if (typeof worker == CONST_FUNCTION) {
                        config.external = false;
                        if (!config.useHelper) {
                            aFuncParts = /function\s*(\w*)(.*)/.exec(worker.toString());
                            aFuncParts[1] = aFuncParts[1] || "a"; // give unnamed functions a name.

                            // reconstruct function signature
                            strWorker = "function " + aFuncParts[1] + aFuncParts[2];
                            strWorker +=  worker.toString().substring(aFuncParts[0].length);

                            strWorker += ";onmessage=function(e){" +
                                ";var result = " + aFuncParts[1] + ".apply(null,e.data);" +
                                // lets just try to make it transferable
                                "postMessage(['"+ CONST_RETURN +"', result], !_async_ ? _transferable_(result) : [])" +
                            "};";

                            // add async and transferable function to worker
                            strWorker += "var _async_ = "+ config.async +";" + _transferable_.toString();

                            if (win.Blob) {
                                blob = new Blob([complete, notify, strWorker], {type: 'application/javascript'});
                            } else if (win.BlobBuilder || win.WebKitBlobBuilder || win.MozBlobBuilder || win.MSBlobBuilder) { // Backwards-compatibility
                                // WARNING: This isn't tested well because I can can't find any
                                //          other browser other than PhantomJS to test with
                                win.BlobBuilder = win.BlobBuilder || win.WebKitBlobBuilder || win.MozBlobBuilder || win.MSBlobBuilder;
                                blob = new BlobBuilder();
                                blob.append(complete);
                                blob.append(notify);
                                blob.append(strWorker);
                                blob = blob.getBlob();
                            }
                        }

                        try {
                            if (config.useHelper) {
                                aFuncParts = /function\s*(\w*)(.*)/.exec(worker.toString());
                                aFuncParts[1] = aFuncParts[1] || "a"; // give unnamed functions a name.

                                // reconstruct function signature
                                strWorker = "function " + aFuncParts[1] + aFuncParts[2];
                                strWorker +=  worker.toString().substring(aFuncParts[0].length);

                                // add async and transferable function to worker
                                //strWorker += ";var _async_ = "+ config.async +";" + transferable.toString();
                                retWorker = new WebworkerGenerator(strWorker, config);
                            } else {
                                retWorker = new WebworkerGenerator(URL.createObjectURL(blob), config);
                            }
                        } catch(e) {}

                    } else {
                        // assume it is a string, and hope for the best
                        config.external = true;
                        retWorker = new WebworkerGenerator(worker, config);

                    // } else {
                    // we can't do webworkers.
                    // FUTURE: Lets shim it. Maybe a timeout?
                    }
                }

                return retWorker;
            };

            function WebworkerGenerator(worker, config) {
                var noop = function() {};

                if (config.external || !config.useHelper) {
                    this.oWorker = new Worker(worker);
                } else {
                    this.oWorker = new Worker(WebworkerConfig.helperPath);
                    this.strWorkerFunc = worker;
                }

                // setup default events so they will always be there
                this.config = angular.extend({
                    onMessage: noop,
                    onError: noop,
                    onReturn: noop,
                    onComplete: noop,
                    onNotice: noop
                }, config);

                // support webworker lowercase style
                if (config.onmessage) {
                    this.config.onMessage = config.onmessage;
                    this.config.onError = config.onerror;
                }
            }

            //TODO: save copy of promise/worker pair so we can terminate
            WebworkerGenerator.prototype.run = function() {
                var oDeferred = $q.defer(),
                    self = this,
                    messageData;

                this.oWorker.onmessage = function(oEvent) {
                    var strType,
                        oData = oEvent.data;

                    if (self.config.external && !self.config.async) {
                        oDeferred.resolve(oData);
                    } else {
                        strType = oEvent.data.shift();
                        oData = oEvent.data[0];

                        self.config.onMessage(oEvent);

                        // don't notify if we are complete or return
                        if (strType != CONST_COMPLETE && strType != CONST_RETURN) {
                            oDeferred.notify(oData);
                        }

                        if (strType == CONST_RETURN) {
                            if (!self.config.async) {
                                oDeferred.resolve(oData);
                            }
                            self.config.onReturn(oData);
                        } else if (strType == CONST_COMPLETE) {
                            oDeferred.resolve(oData);
                            self.config.onComplete(oData);
                        } else if (strType == CONST_NOTICE) {
                            self.config.onNotice(oData);
                        }
                    }
                };

                this.oWorker.onerror = function(oError) {
                    oDeferred.reject(oError);
                };

                if (self.config.external || !self.config.useHelper) {
                    //FUTURE: Use Array.slice(arguments) when available for V8 optimization
                    messageData = Array.prototype.slice.call(arguments);
                } else {
                    //FUTURE: Use Array.slice(arguments) when available for V8 optimization
                    messageData = {
                        fn: self.strWorkerFunc,
                        args: Array.prototype.slice.call(arguments)
                    };
                }

                this.oWorker.postMessage(messageData, transferable(messageData, this));

                if (!self.config.external && !self.config.useHelper) {
                    oDeferred.promise.finally(function () {
                        // Every time run happens on a dynamic web worker it
                        // creates a new web worker to prevent a thread leak,
                        // a worker will only last once
                        self.terminate();
                    });
                }

                return oDeferred.promise;
            };

            WebworkerGenerator.prototype.stop = function() {
                this.oWorker.onerror(new Error('stopped'));
                this.terminate();
            };

            WebworkerGenerator.prototype.terminate = function() {
                this.oWorker.terminate();
            };

            function transferable(messageData, worker) {
                // FUTURE: CanvasProxy and MessagePort when browsers support it.
                var messageDataTransfers = [];

                // the worker_wrapper helper doesn't support transfers right now
                if (worker.config.transferOwnership && !worker.config.useHelper) {
                    angular.forEach(messageData, function(data) {
                        if (data instanceof ArrayBuffer) {
                            messageDataTransfers.push(data);
                        }
                    });
                }

                return messageDataTransfers;
            }

            function complete(mVal) {
                // _transferable_ is added to the worker
                postMessage(["complete", mVal], _transferable_(mVal))
            }
            function notify(mVal) {
                postMessage(["notice", mVal])
            }
        }

        this.$get = ['$q', function($q) {
            return new Webworker($q);
        }];
    });


    return oWebworkerModule;
});

angular.module('myApp').service('workerService', ["Webworker", function(Webworker) {

  this.worker = (qId, answer, userCode) => {

    function isSame(userCode, answer) {
      if (userCode === answer) {
        return true;
      } else {
        return false;
      }
    }

    var myWorker = Webworker.create(isSame);

    myWorker.run(userCode, answer).then((result) => {
      alert(`This is ${result}`);
    })
  }
}])

/**
 * ng-webworker - ng-webworker creates dynamic webworkers so angular apps can be multi-threaded.
 * @link https://github.com/mattslocum/ng-webworker
 * @license MIT
 */

(function() {
    //NOTE: transferable doesn't work for the worker_wrapper.
    function complete(mVal) {
        // _transferable_ is added to the worker
        postMessage(["complete", mVal])
    }
    function notify(mVal) {
        // _transferable_ is added to the worker
        postMessage(["notice", mVal])
    }

    self.onmessage = function(oEvent) {
        var aFuncParts = /function\s*(\w+)(.*)/.exec(oEvent.data.fn),
            aParts = oEvent.data.args,
            result;
        aParts.push(oEvent.data.fn);

        eval("self['" + aFuncParts[1] + "'] = " + oEvent.data.fn);

        postMessage([
            'return',
            self[aFuncParts[1]].apply(null, oEvent.data.args)
        ]);
    };

})();

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

    }
  }

})  // end lessonsSideBarDirective

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
