var app = angular.module('myApp', ['ngCookies', 'ngRoute', 'app.ctrl', 'admin.ctrl']);

app.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function (newV) {
        $rootScope.path = $location.path()
    });
}]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'ctrl.home',
            templateUrl: 'views/home.html',
        })
        .when('/music', {
            controller: 'ctrl.music',
            templateUrl: 'views/music.html'
        })
        .when('/music/:id', {
            controller: 'ctrl.music.detail',
            templateUrl: 'views/music-detail.html'
        })
        .when('/movie', {
            controller: 'ctrl.movie',
            templateUrl: 'views/movie.html'
        })
        .when('/movie/:id', {
            controller: 'ctrl.movie.detail',
            templateUrl: 'views/movie-detail.html'
        })
        .when('/blog', {
            controller: 'ctrl.blog',
            templateUrl: 'views/blog.html'
        })
        .when('/blog/:id', {
            controller: 'ctrl.blog.detail',
            templateUrl: 'views/blog-detail.html'
        })
        .when('/admin/music', {
            controller: 'ctrl.admin.music',
            templateUrl: 'views/admin/music.html'
        })
        .when('/admin/movie', {
            controller: 'ctrl.admin.movie',
            templateUrl: 'views/admin/movie.html'
        })
        .when('/admin/blog', {
            controller: 'ctrl.admin.blog',
            templateUrl: 'views/admin/blog.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('navCtrl', ['$scope', '$rootScope', '$cookieStore', function ($scope, $rootScope, $cookieStore) {
    $scope.signout = function () {
        $cookieStore.remove('user');
        $rootScope.account = $cookieStore.get('user');
    }
}]);