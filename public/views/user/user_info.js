app.controller('ProfileCtrl', function ($scope, $http, $rootScope, $modal) {
    $scope.showDetails = false;

    $http.get("/following")
    .success(function (users) {
        console.log(users.following);
        $scope.following = users.following;
    });

    $scope.newMessage = function (uname) {

        $rootScope.receiver = uname.name;
        var modalInstance = $modal.open({
            templateUrl: 'views/message-modal/message-modal.html',
            controller: 'NewMessageModalCtrl',
        });
    }
    $scope.UserDetails = function (uname) {
        $scope.showDetails = true;
        console.log("in userdetails");
        $http.get("https://api.github.com/users/" + uname.name)
        .success(function (data) {
            console.log(data);

            $rootScope.username = data.name;
            $rootScope.github_username = data.login;

            if (data.email == "" || data.email == null)
                $rootScope.email = "Email not Shared";

            else
                $rootScope.email = data.email;

            $rootScope.public_repos = data.public_repos;
            $rootScope.git_url = data.html_url;
        })
        .error(function () {
            $scope.userNotFound = true;
        });
    }




    // Update User's Rating 
    $scope.rating = 5;
    $scope.rateFunction = function (rating, uname) {
        var user = uname.name;

        $http.put("/rate/" + rating + "/" + user)
       .success(function (res) {
           console.log(res);
           $scope.rated = res;
       })
    };
})
  .directive('starRating',
	function () {
	    return {
	        restrict: 'A',
	        template: '<ul class="rating">'
					 + '	<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
					 + '\u2605'
					 + '</li>'
					 + '</ul>',
	        scope: {
	            ratingValue: '=',
	            max: '=',
	            onRatingSelected: '&'
	        },
	        link: function (scope, elem, attrs) {
	            var updateStars = function () {
	                scope.stars = [];
	                for (var i = 0; i < scope.max; i++) {
	                    scope.stars.push({
	                        filled: i < scope.ratingValue
	                    });
	                }
	            };

	            scope.toggle = function (index) {
	                scope.ratingValue = index + 1;
	                scope.onRatingSelected({
	                    rating: index + 1
	                });
	            };

	            scope.$watch('ratingValue',
					function (oldVal, newVal) {
					    if (newVal) {
					        updateStars();
					    }
					}
				);
	        }
	    };
	}
);
