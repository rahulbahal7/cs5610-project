app.controller('NewMessageModalCtrl', function ($scope, $http, $rootScope, $modalInstance) {
    console.log("in modal controller");

    $scope.sendMessage = function (message, uname) {
        var receiver = $rootScope.receiver;
        console.log(receiver);
        $http.put("/sendmessage/" + message + "/" + receiver)
		.success(function (res) {
		    console.log(res);
		    $modalInstance.dismiss('cancel');
		});
    }    
});
