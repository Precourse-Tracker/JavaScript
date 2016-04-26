angular.module('myApp').service('workerService', function(Webworker) {

  this.worker = (qId, answer, userCode, setup) => {
    console.log("setup in worker", setup);

    function isSame(userCode, answer, setup) {
      console.log("userCode", userCode, setup);
      var userInput = userCode;
      eval(userInput);
      console.log("userInput",userInput);
      var results = setup();
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

    var result = myWorker.run(userCode, answer, setup);
    return result;
  }
})
