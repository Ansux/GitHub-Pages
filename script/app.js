var app = angular.module('myApp', ['ngCookies', 'ngRoute', 'app.ctrls', 'admin.ctrl', 'app.directives'], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function (data) {
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
      }];
});

app.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function (newV) {
        $rootScope.path = $location.path()
    });
}]);

app.config(function ($routeProvider, $locationProvider) {
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
        .when('/blog/cate/:id', {
            controller: 'ctrl.blog.cate',
            templateUrl: 'views/blog.html'
        })
        .when('/blog/author/:id', {
            controller: 'ctrl.blog.author',
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

    // $locationProvider.html5Mode(true);
});

app.controller('ctrl.nav', ['$scope', '$rootScope', '$cookieStore', function ($scope, $rootScope, $cookieStore) {
    $scope.signout = function () {
        $cookieStore.remove('user');
        $rootScope.account = $cookieStore.get('user');
    }
}]);

app.filter('toStrusted', ['$sce', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    }
}])