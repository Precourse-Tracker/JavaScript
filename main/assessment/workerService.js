angular.module('myApp').service('workerService', function(Webworker) {

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
})
