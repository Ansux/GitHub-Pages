var ctrl = angular.module('appCtrl', []);

var host = "http://localhost/ansux/1/index.php/blogs/";
var postConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: function (data) {
        return $.param(data);
    }
};

// 首页模块
ctrl.controller('homeCtrl', function ($scope, $http) {
    $scope.title = 'i am home page';
});

// 音乐模块
ctrl.controller('musicCtrl', function ($scope, $http) {
    $scope.title = 'i am other page';
});

// 音乐详情
ctrl.controller('musicDetailCtrl', function ($scope, $routeParams, $location) {
    var id = $routeParams.id;
    if (id == 0) {
        $location.path('/other');
    }
    $scope.title = 'i am otherDetailCtrl page';
});

// 电影模块
ctrl.controller('movieCtrl', function ($scope) {
    $scope.title = 'i am other page';
});

// 电影详情
ctrl.controller('movieDetailCtrl', function ($scope, $routeParams, $location) {
    var id = $routeParams.id;
    if (id == 0) {
        $location.path('/other');
    }
    $scope.title = 'i am otherDetailCtrl page';
});

// 博客模块
ctrl.controller('blogCtrl', function ($scope, $http, $timeout, $rootScope) {
    $scope.list = function () {
        $http.post(host + 'blog/getlist', {}).success(function (res) {
            $scope.blogList = $.parseJSON(res);
        });
    }

    $scope.title = 'i am other page';
    $scope.category = {
        name: ''
    }

    $scope.existCateFlag = false;
    $scope.existCateName = function () {
        if ($scope.category.name != undefined && $scope.category.name.length != 0) {
            $http.post(host + 'category/existName', {
                name: $scope.category.name
            }, postConfig).success(function (res) {
                res = $.parseJSON(res);
                $scope.existCateFlag = res ? true : false;
            });
        }
    }

    $scope.submit = function () {
        $http.post(host + 'category/create', {
            category: $scope.category
        }, postConfig).success(function (res) {
            $('#cateModal').modal('hide');
            $timeout(function () {
                $scope.category.name = '';
                $scope.category.name.reset();
            }, 1000)
        });
    }

    $scope.showBlogModal = function () {
        $http.post(host + 'category/getList', {}).success(function (res) {
            $scope.cateList = $.parseJSON(res);
            if ($scope.cateList != null) {
                $scope.cateList[0].isSelected = true;
            }
        });
    }

    $scope.blog = {
        author: $rootScope.account.id,
        category: '1'
    };
    $scope.blogSubmit = function () {
        $http.post(host + 'blog/create', {
            blog: $scope.blog
        }, postConfig).success(function (res) {
            $('#blogModal').modal('hide');
        });
    }

});


// 博客详情
ctrl.controller('blogDetailCtrl', function ($scope, $routeParams, $location) {
    var id = $routeParams.id;
    if (id == 0) {
        $location.path('/other');
    }
    $scope.title = 'i am otherDetailCtrl page';
});


var admin = angular.module('adminCtrl', []);