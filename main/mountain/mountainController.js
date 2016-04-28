angular.module( 'myApp' )
  .controller( 'mountainController', [ '$scope', 'loginService', 'mountainSvc', function ( $scope, loginService, mountainSvc ) {


    $scope.logoutUser = function () {
      loginService.logoutUser();
    };

    $scope.getUser = function ( id ) {
      mountainSvc.getUser( id )
        .then( function ( response ) {
          console.log(response);
          $scope.user = response.data
          console.log($scope.user[0]);
        } )
    }
    $scope.logevent = mountainSvc.logevent;
    $scope.getCurrentUser = mountainSvc.getCurrentUser;
    // let user = getUser();
    // let progress = user.progress;
    // console.log(user);
    // console.log(progress);

} ] );
