angular.module('myApp').service('workerService', function(Webworker) {

  this.worker = (qId, answer, userCode) => {

    function isSame(userCode, answer) {
      if (userCode === answer) {
        return true;
      } else {
        return false;
      }
    }

    var myWorker = Webworker.create(isSame, {
      onReturn: function(data) {alert(`This is ${data}`);}
    });

    myWorker.run(userCode, answer).then((result) => {
      alert(`This is ${result}`);
    })
  }
})
