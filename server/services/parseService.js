const unitCtrl = require('../controllers/unitController.js');
const q = require('q');

module.exports.parseData = (data) => {
  var deferred = q.defer();
  try {
    var progressData = {
      progress: data.progress
    }




  } catch(err) {
    return err;
  }
  console.log("progressData", progressData);

  deferred.resolve(progressData);


  return deferred.promise;
}
