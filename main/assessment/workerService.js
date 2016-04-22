angular.module('myApp').service('workerService', function(Webworker) {

  this.worker = (qId, answer, userCode) => {

    function isSame(userCode, answer) {
      // var evaluatedCode = eval(userCode);
      console.log("userCode", userCode, answer);
      var userInput = userCode;
      eval(userCode);
      var results = timesTwo(num1, num2);
      console.log(results);
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
})
