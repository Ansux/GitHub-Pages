var app = angular.module('myApp', ['ngCookies', 'ngRoute', 'appCtrl', 'adminCtrl']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'homeCtrl',
            templateUrl: 'views/home.html',
        })
        .when('/music', {
            controller: 'musicCtrl',
            templateUrl: 'views/music.html'
        })
        .when('/music/:id', {
            controller: 'musicDetailCtrl',
            templateUrl: 'views/music-detail.html'
        })
        .when('/movie', {
            controller: 'movieCtrl',
            templateUrl: 'views/movie.html'
        })
        .when('/movie/:id', {
            controller: 'movieDetailCtrl',
            templateUrl: 'views/movie-detail.html'
        })
        .when('/blog', {
            controller: 'blogCtrl',
            templateUrl: 'views/blog.html'
        })
        .when('/blog/:id', {
            controller: 'blogDetailCtrl',
            templateUrl: 'views/blog-detail.html'
        })
        .when('/admin/music', {
            controller: 'musicAdminCtrl',
            templateUrl: 'views/admin/music.html'
        })
        .when('/admin/movie', {
            controller: 'movieAdminCtrl',
            templateUrl: 'views/admin/movie.html'
        })
        .when('/admin/blog', {
            controller: 'blogAdminCtrl',
            templateUrl: 'views/admin/blog.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

var host = "http://localhost/ansux/1/index.php/blogs/";
var postConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: function (data) {
        return $.param(data);
    }
};

app.controller('signupCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.user = {
        uid: '',
        upwd: '',
        pwd: '',
        email: ''
    };
    $scope.submit = function () {
        $http.post(host + 'user/signup', {
            user: $scope.user
        }, postConfig).success(function (res) {
            console.log(res);
        });
    }
}]);

app.controller('signinCtrl', ['$scope', '$rootScope', '$http', '$cookieStore', function ($scope, $rootScope, $http, $cookieStore) {
    $rootScope.account = $cookieStore.get('user');
    $scope.user = {
        uid: '',
        upwd: ''
    };
    $scope.submit = function () {
        $http.post(host + 'user/signin', {
            user: $scope.user
        }, postConfig).success(function (res) {
            res = $.parseJSON(res);
            if (res.status) {
                $('#signinModal').modal('hide');
                $cookieStore.put('user', res.user);
                $rootScope.account = $cookieStore.get('user');
            } else {
                console.log(res.msg);
            }
        });
    }
}]);

app.controller('navCtrl', ['$scope', '$rootScope', '$cookieStore', function ($scope, $rootScope, $cookieStore) {
    $scope.signout = function () {
        $cookieStore.remove('user');
        $rootScope.account = $cookieStore.get('user');
    }
}]);