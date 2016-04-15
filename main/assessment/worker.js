// (function(){

  angular.module("myApp")

  .service("jsTesting", function ($q, jsTesting, assessmentService){


    this.testJS = testJS;
      // async was injected
    function testJS(answer, userCode, deferred, worker){

      if(!worker) worker = new Worker('worker.js');


      // ??
      // var test = tests.shift();



      userCode += userCode ? ("\n" + userCode) : "";



      var userCode = {
        userCode: userCode
        // async: !!async
      };

      //pretty sure this is where the testing begins. Their message is our userCode

      //testing some stuff. Vars contains the actual answer
      if (answer) {
        userCode = answer;
        return true;
      } else {
        return false;
      }
      //testing an alert?? Maybe to in place of returning a function or something. Not too worried about this.

      // if (test._alert) {
      //   userCode.alert = test._alert;
      // }

      //invoking the function to test??

      // if (test.invoke) {
      //   userCode.invoke = test.invoke;
      // }

      //not too sure why

      // if (test.hasOwnProperty('_out')) {
      //   userCode.out = test._out;
      // }

      // if input is blank, terminate

      // workerRun(worker, userCode).then(function(userCode){
      //   if(!answer.length){
      //     worker.terminate();
      //     deferred.resolve(userCode);
      //   } else {
      //
      //     // async was injected. Not sure why this is here
      //
      //     testJS(answer, userCode, deferred, worker);
      //   }
      //
      // // if amount of attempts have reached LIMIT, terminate
      // }

      // , function(error){
      //   worker.terminate();
      //   error.data.answerRemaining = answer.length;
      //   deferred.reject(error);
      // }

    );


    }




    // function workerRun(worker, workerCode){
    //
    //   var dfd = $q.defer();
    //
    //   var timeout = setTimeout(function(){
    //     dfd.reject({data: {content: "Your userCode is taking too long to evaluate. Perhaps you have an infinite loop, or if this test is asynchronous you might not have called 'done'. It could also be as simple as your browser running slowly and needing a refresh."}});
    //   }, 6000);
    //
    //
    //   // worker.onmessage = function(userCode) {
    //   //   clearTimeout(timeout);
    //   //   if (userCode === 'error') {
    //   //     dfd.reject(userCode);
    //   //   }
    //   //   else {
    //   //     if (userCode.data.alert_content && userCode.data.alert_content.out) {
    //   //       alert(userCode.data.alert_content.out);
    //   //     }
    //   //     dfd.resolve(userCode);
    //   //   }
    //   // };
    //
    //   worker.postMessage(workerCode);
    //   return dfd.promise;
    // }


  }
});
