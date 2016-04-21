angular.module( 'myApp' )
  .directive( 'mountainDirective', function () {
    var dirDefinition = {
      restrict: 'E',
      templateUrl: './html/mountain/mountainTemplate.html',
      controller: 'mountainController',
      link: function ( scope, element, attrs, controller, transcludeFn, animate ) {
        const xMin = -3;
        const xMax = 33;

        const randomMinMax = function ( xMin, xMax ) {
          var posX = Math.random() * ( xMax - xMin + 1 ) + xMin;
          return posX
        }

        const findY = function ( x ) {
          var yMax
          if ( x < ( xMax / 2 ) ) {
            yMax = ( x + 7 );
          } else {
            yMax = ( xMax - x ) + 5;
          }
          return yMax;
        }
        const randomGrn = function () {
          let rd = Math.floor( randomMinMax( 60, 90 ) );
          let grn = Math.floor( randomMinMax( 70, 180 ) );
          let bl = Math.floor( randomMinMax( 60, 90 ) );
          return ( 'rgb(' + rd + ', ' + grn + ', ' + bl + ')' );
        }

        scope.spawnTrees = function ( number ) {
          for ( var i = 0; i < number; i++ ) {
            var aCoords = randomMinMax( -3, 33 );
            var bCoords = randomMinMax( -3, 33 );
            var x = aCoords;
            var y = randomMinMax( 5, findY( aCoords ) );

            var node = document.getElementById( 'home-top' );
            var myTrees = document.getElementById( 'my-icon' );

            var i1 = document.createElement( 'i' );
            var i2 = document.createElement( 'i' );
            var i3 = document.createElement( 'i' );
            var i4 = document.createElement( 'i' );

            var newGrn = randomGrn();
            var newZ = (220 + (Math.floor(Math.floor(10 - (100*y))/10)));
            console.log(newZ);
            var trunkZ = newZ - 1;

            // little guy top \\
            i1.style.zIndex = (newZ);
            i1.style.border = '0.39em solid transparent';
            i1.style.borderBottom = '0.39em solid ' + newGrn;
            i1.style.left = ( x - 16.2 ) + 'em';
            i1.style.bottom = ( y -24.9 ) + 'em';

            // mid branches \\
            i2.style.zIndex = (newZ);
            i2.style.border = '0.55em solid transparent';
            i2.style.borderBottom = '0.55em solid ' + newGrn;
            i2.style.left = ( x - 16.4 ) + 'em';
            i2.style.bottom = ( y -24.25 ) + 'em';

            // base branches \\
            i3.style.zIndex = (newZ);
            i3.style.border = '0.55em solid transparent';
            i3.style.borderBottom = '0.75em solid ' + newGrn;
            i3.style.left = ( x - 16.4 ) + 'em';
            i3.style.bottom = ( y -24.7 ) + 'em';

            // trunk bottom \\
            i4.style.zIndex = (trunkZ);
            i4.style.border = 'none';
            i4.style.width = '.15em';
            i4.style.height = '0.31em';
            i4.style.marginBottom = '0em';
            i4.style.backgroundColor = '#522200';
            i4.style.left = ( x - 16 ) + 'em';
            i4.style.bottom = ( y - 25 ) + 'em';

            node.appendChild( i1 );
            node.appendChild( i2 );
            node.appendChild( i3 );
            node.appendChild( i4 );
          }
        }
        // scope.spawnClimber = function(){
        //
        // }
      }
    }
    return dirDefinition;

  } ) // end mountainDirective
