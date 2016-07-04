angular.module( "myApp" ).service( "mountainSvc", function ( $http ) {



  this.getUser = function ( id ) {
    // console.log( id );
    return $http( {
        method: 'GET',
        url: '/api/users/?_id=' + id
      } )
      .then( function ( response ) {
        return response
      } );
  };

  this.logevent = function () {
    console.log( 'event' );
  };

  this.getCurrentUser = function (){
    console.log('svc.getCurrentUser');
    return $http( {
        method: 'GET',
        url: '/user/current'
      } )
      .then( function ( response ) {
        console.log('svc.then');
        return response;
      } );
  };




} );
