app.controller("HomeController", function ($scope, $http, $rootScope) {
    var a = $rootScope.currentUser;
    
    if (a != null)
    	$scope.display_name = a.username;
    
    console.log(a);
    //console.log(a.username);
    console.log("here1");
});