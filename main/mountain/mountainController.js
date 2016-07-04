angular.module( 'myApp' )
  .controller( 'mountainController', [ '$scope', 'loginService', 'mountainSvc', function ( $scope, loginService, mountainSvc ) {


    $scope.logoutUser = function () {
      loginService.logoutUser();
    };

    $scope.getUser = function ( id ) {
      mountainSvc.getUser( id )
        .then( function ( response ) {
          // console.log(response);
          $scope.user = response.data
          console.log($scope.user[0]);
          return $scope.user[0];
        } )
    }

    $scope.getCurrentUser = function() {
      $scope.currentUser = mountainSvc.getCurrentUser()
      .then(function(response){
        console.log('response from Ctrl', response.data.progress.lessons);
        return response.data.progress.lessons;
      })
    }

    $scope.logevent = mountainSvc.logevent;
    // $scope.getCurrentUser = mountainSvc.getCurrentUser();
    // let user = getUser();
    // let progress = user.progress;
    // console.log(user);
    // console.log(progress);

} ] );
