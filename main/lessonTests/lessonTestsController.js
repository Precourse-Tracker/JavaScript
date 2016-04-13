angular.module('myApp')

.controller('lessonTestsController', function($scope) {

var editor = ace.edit("editor");
editor.setTheme("ace/theme/default");
editor.getSession().setMode("ace/mode/javascript");

})
