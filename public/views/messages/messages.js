app.controller('MessageCtrl', function ($scope, $http) {

    console.log("outside function call in messages.js");

    $http.get("/messages")
    .success(function (messages) {
        console.log(messages);
        $scope.msgs = messages;
    });
});