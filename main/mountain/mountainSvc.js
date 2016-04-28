angular.module( "myApp" ).service( "mountainSvc", function ($http) {



  this.getUser = function (id) {
    console.log( id );
    return $http( {
        method: 'GET',
        url: '/api/users/?_id=' + id
      } )
      .then( function ( response ) {
        return response
      } );
  };


} );
