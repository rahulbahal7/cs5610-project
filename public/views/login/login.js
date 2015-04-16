app.controller("LoginController", function ($scope, $http, $location, $rootScope) {
    $scope.login = function (user) {

        //Request the server(Passport) with the POST method
        //Passport will reply with a authorized user object or 401 error
        $http.post("/login", user)
		.success(function (res) {
		    console.log(res);
		    console.log("after login: " + $scope.logincheck);

		    //then navigate to the Profile Page
		    $rootScope.currentUser = res;
		    $location.url("/home");
		})
	    .error(function (data, status) {
	        console.error('Error', status, data);
	        alert("Invalid Login Credentials");
	    });
    }

    $scope.register = function (user1) {
        console.log(user1);

        if (user1.password == user1.password2) {
            $http.post("/register", user1)
            .success(function (res) {
                console.log(res);

                //make the user the current user and pass to profile
                $rootScope.currentUser = res;
                $location.url("/home");
            });
        }
    }
});