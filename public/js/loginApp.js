var app = angular.module("LoginApp", ["ngRoute", "ui.bootstrap" ]);

app.config(function ($routeProvider, $httpProvider) {
    $routeProvider
		.when('/home', {
		    templateUrl: 'views/home/home.html',
		    controller: 'HomeController',
		    resolve: {
		        loggedin: checkLoggedin
		    }
		})
		.when('/profile', {
		    templateUrl: 'views/profile/profile.html',
		    resolve: {
		        loggedin: checkLoggedin
		    }
		})
		.when('/login', {
		    templateUrl: 'views/login/login.html',
		    controller: 'LoginController'
		})
		.when('/register', {
		    templateUrl: 'views/register/register.html',
		    controller: 'LoginController'
		})
        .when('/user_info', {
            templateUrl: 'views/user/user_info.html',
            controller: 'ProfileCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .when('/messages', {
            templateUrl: 'views/messages/messages.html',
            controller: 'MessageCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
        })
		.otherwise({
		    redirectTo: '/login'
		})
});

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user !== '0')
            deferred.resolve();

            // User is Not Authenticated
        else {
            $rootScope.errorMessage = 'Invalid Credentials or User does\'nt exist.';
            deferred.reject();
            $location.url('/login');
        }
    });
    return deferred.promise;
};

// Navigation Controller
app.controller("NavCtrl", function ($scope, $http, $location, $rootScope) {
    //Logout and make the currently set cookie invalid and redirect to Login 
    $scope.logout = function () {
        $http.post("/logout")
		.success(function () {
		    $rootScope.currentUser = null;
		    $rootScope.username = null;
		    $rootScope.github_username = null;
		    $rootScope.email = null;
		    $rootScope.public_repos = null;
		    $rootScope.git_url = null;
		    $location.url("/login");
		});
    };
})

// Retrieve search information
app.controller("GitHubCtrl", function ($scope, $http) {
    $scope.getGitInfo = function () {
        $scope.userNotFound = false;
        $scope.loaded = false;
        $scope.pages = 0;
        //$scope.page_no =1;
        $scope.upper_bound = 1;
        $scope.lower_bound = 1;

        $http.get("https://api.github.com/search/users?q=" + $scope.username +
         "+repos:%3E0+followers:%3E0&page=" + $scope.page_no).success(
         function (data) {
             $scope.searchedUsers = data;
             $scope.totalResults = $scope.searchedUsers.total_count;
             $scope.pages = Math.ceil($scope.totalResults / 30);

             if ($scope.page_no == null)
                 $scope.page_no = 1;

             $scope.lower_bound = ($scope.page_no - 1) * 30;
             $scope.upper_bound = $scope.lower_bound + 30;

             if ($scope.page_no == $scope.pages)
                 $scope.upper_bound = $scope.pages * 30 - ($scope.pages * 30 - $scope.totalResults);
             $scope.searchItems = $scope.searchedUsers.items;
         });

        $http.get("https://api.github.com/users/" + $scope.username)
        .success(function (data) {
            if (data.name == "") data.name = data.login;
            $scope.user = data;
            $scope.loaded = true;
        })
        .error(function () {
            $scope.userNotFound = true;
        });

        $http.get("https://api.github.com/users/" + $scope.username + "/repos").success(function (data) {
            $scope.repos = data;
            $scope.reposFound = data.length > 0;
        });
    }
});

// Retrieve the user information
app.controller("UserInfoController", function ($scope, $http, $rootScope) {
    $scope.getUserInfo = function (u) {
        $http.get("https://api.github.com/users/" + u)
        .success(function (data1) {
            $rootScope.username_from_git = data1.name;
            $rootScope.github_username = data1.login;

            if (data1.email == "" || data1.email == null)
                $rootScope.git_email = "This user has not shared their email";

            else
                $rootScope.git_email = data1.email;

            $rootScope.number_of_public_repos = data1.public_repos;
            $rootScope.user_git_url = data1.html_url;
        })
        .error(function () {
            $scope.userNotFound = true;
        });
    }

    $scope.addUser = function (u) {
        var loggedin_user;
        //Check if a user is currently logged in or not
        if ($rootScope.currentUser != undefined)
            loggedin_user = $rootScope.currentUser.username;

        $http.put("/follow/" + u)
        .success(function (res) {
            $scope.following = res;
            alert("You are now following " + u);
        })
    }
});
