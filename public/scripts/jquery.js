$(document).ready(function() {

  console.log('document ready')

  $('#profile-wrapper').on('click', function() {
    console.log('hi');
    $('#menu-navigation').toggleClass('expand');
  })

}) // end jquery
