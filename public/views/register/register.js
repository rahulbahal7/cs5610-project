app.controller("RegisterController", function($scope, $http, $location, $rootScope){
	$scope.register = function(user1){
		console.log(user1);


		if(user1.password == user1.password2){
		$http.post("/register", user1)
		.success (function(res){
			console.log(res);

			//make the user the current user and pass to profile
			$rootScope.currentUser = res;
			$location.url("/profile");
		});
	}
	}
});