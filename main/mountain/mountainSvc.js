angular.module( "myApp" ).service( "mountainSvc", function () {

  // I needed a forEach method that works nicely with nodelists
  var myForEach = function ( array, callback, scope ) {
    for ( var i = 0; i < array.length; i++ ) {
      callback.call( scope, i, array[ i ] );
    }
  };

} );
