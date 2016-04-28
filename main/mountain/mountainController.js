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
    console.log($scope.getUser('57150955710833b8272b9b2f'));
    console.log($scope.user);
    // let user = getUser();
    // let progress = user.progress;
    // console.log(user);
    // console.log(progress);

} ] );
