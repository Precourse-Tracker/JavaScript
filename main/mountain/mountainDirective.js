angular.module( 'myApp' )
  .directive( 'mountainDirective', function () {
    var dirDefinition = {
      restrict: 'E',
      templateUrl: './html/mountain/mountainTemplate.html',
      controller: 'mountainController',
      link: function ( scope, element, attrs, controller, transcludeFn, animate ) {
        const xMin = -3;
        const xMax = 33;

        const randomLocation = function ( xMin, xMax /*, yMin, yMax*/ ) {
          console.log( 'randomLocation is logging' );
          var posX = Math.floor( Math.random() * ( xMax - xMin + 1 ) ) + xMin;
          return {
            x: posX,
          }
        }

        scope.spawnTrees = function ( number ) {
          console.log( 'spawnTrees was called' );
          for ( var i = 0; i < number; i++ ) {
            var aCoords = randomLocation( -3, 33 /*, 5, 22*/ );
            var bCoords = randomLocation( -3, 33 /*, 5, 22*/ );
            var x = aCoords.x;
            var y = randomLocation( 5, findY( aCoords.x ) ).x;

            function findY( x ) {
              console.log( 'x from inside findY', x );
              var yMax
              if ( x < ( xMax / 2 ) ) {
                yMax = ( x + 7 );
              } else {
                yMax = ( xMax - x ) + 4;
              }
              return yMax;
            }
            console.log( 'spawnTrees was looped: ' + [ i + 1 ] + ' times' );
            var node = document.getElementById( 'mtn-wrapper' );
            var newDiv = document.createElement( 'div' );
            var i1 = document.createElement( 'i' );
            var i2 = document.createElement( 'i' );
            var i3 = document.createElement( 'i' );
            var i4 = document.createElement( 'i' );
            // newDiv.style.width = '2.4em';
            // newDiv.style.height = '2em';
            // newDiv.innerHTML = 'Hello';
            // newDiv.style.position = 'absolute';
            // newDiv.style.left = x + 'em';
            // newDiv.style.bottom = y + 'em';
            // newDiv.style.background = 'red';
            i1.style.width = '2em';
            i1.style.border = '0.55em solid transparent';
            i1.innerHTML = 'Hello';
            i1.style.margin = '-0.55em 0 0 0';
            i1.style.width = '';
            i1.style.width = '';
            i1.style.width = '';
            i1.style.width = '';
            i1.style.width = '';

/*.my-icon > i {
    : ;
    : ;
    border-bottom: 0.55em solid green;
    left: 1.045em;
    top: 0.78em;
}

.my-icon > i+i {

    border: 0.55em solid transparent;
    margin-top: -0.55em;
    border-bottom: 0.55em solid green;
    left: -0.2em;
    top: 0.47em;
}

.my-icon > i+i+i {
    position: relative;
    display: inline-block;
    width: 0;
    height: 0;
    line-height: 0;
    border: 0.39473684210526316em solid transparent;
    margin-top: -0.39473684210526316em;
    border-bottom: 0.39473684210526316em solid green;
    left: 1.185em;
    top: -1.1em;
}

.my-icon > i+i+i+i {
    position: relative;
    display: inline-block;
    border: 0px;
    border-style: none;
    width: 0.15em;
    height: 0.31em;
    background-color: #522200;
    left: 0.53em;
    top: -0.2em;
}*/


            node.appendChild( newDiv );
            node.appendChild( i1 );

            console.log( 'x: ' + x, 'y: ', y );
            console.log( newDiv.style );

            var currentDiv = document.getElementsByClassName( 'trees' )[ 0 ];
            // trees.insertBefore( newDiv, currentDiv );
          }
        }
      }
    }
    return dirDefinition;

  } ) // end mountainDirective

// various attempts at constraining trees \\
// var base = Math.abs( aCoords.x - bCoords.x );
// var height = Math.abs( aCoords.y - bCoords.y );
//
// console.log( 'base: ', base, 'height: ', height );
// var aLength = 3;
// var bLength = 4;
// var hypLength = Math.sqrt( aLength * aLength + bLength * bLength );
// // console.log('aCoordsX ', aCoords.x, 'aCoordsY: ', aCoords.y);



// better randomization \\
// var v1 = Math.floor( Math.random() * 10 );
// var v2 = Math.floor( Math.random() * 10 );
// var a1 = Math.floor( Math.random() * 10 );
// var a2 = Math.floor( Math.random() * 10 );
// var vy1 = Math.floor( Math.random() * 10 );
// var vy2 = Math.floor( Math.random() * 10 );
// var ay1 = Math.floor( Math.random() * 10 );
// var ay2 = Math.floor( Math.random() * 10 );
// var Qx = Math.floor( ( ( a1 * v1 ) + ( a2 * v2 ) ) / 10 );
// var Qy = Math.floor( ( ( ay1 * vy1 ) + ( ay2 * vy2 ) ) / 10 );
// console.log( 'Qx: ', Qx );
// console.log( 'Qy: ', Qy );
