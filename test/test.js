describe("true", function() {
  beforeEach(module('myApp'));

  var $controller, assessmentController;
  var $service, assessmentService, workerService;
  var $scope;
  beforeEach(inject(function(_$controller_, _assessmentService_, _workerService_, $rootScope){
    $controller = _$controller_;
    $scope = $rootScope.$new();
    assessmentController = $controller('assessmentController', {$scope: $scope});
    assessmentService = _assessmentService_;
    workerService = _workerService_;
  }))





  it("should contain users code and question object properties", function() {
    
  });
});
