var host = "http://ansux.sinaapp.com/blogs/";
angular.module('app.ctrls', [])
    .controller('ctrl.signup', ['$scope', '$http', function ($scope, $http) {
        $scope.user = null;
        $scope.submit = function () {
            $http.post(host + 'user/signup', {
                user: $scope.user
            }).success(function (res) {
                $('#signupModal').modal('hide');
                console.log(res);
            });
        }
   }])
    .controller('ctrl.signin', ['$scope', '$rootScope', '$http', '$cookieStore', function ($scope, $rootScope, $http, $cookieStore) {
        $rootScope.account = $cookieStore.get('user');
        $scope.user = undefined;
        $scope.submit = function () {
            $http.post(host + 'user/signin', {
                user: $scope.user
            }).success(function (res) {
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
   }])
    .controller('ctrl.home', function ($scope, $http) {
        $scope.title = 'i am home page';
    })
    .controller('ctrl.music', function ($scope, $http) {
        $scope.title = 'i am other page';
    })
    .controller('ctrl.music.detail', function ($scope, $routeParams, $location) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        $scope.title = 'i am otherDetailCtrl page';
    })
    .controller('ctrl.movie', function ($scope, $http) {
        $scope.getApi = function () {
            $scope.movieApi = '请选择';
            $http.get(host + 'movie/api?name=' + $scope.name).success(function (res) {
                $scope.movies = res.data.movie;
                $scope.movies.num = res.data.num;
            });
        }
        $scope.selectMovie = function (movie) {
            $scope.movie = $.parseJSON(movie);
        }
        $scope.submit = function () {
            $http.post(host + 'movie/create', {
                movie: $scope.movie,
                review: $scope.review
            }).success(function (res) {

            });
            console.log($scope.movie);
            console.log($scope.review != undefined && $scope.review.content.length != 0);
        }
    })
    .controller('ctrl.movie.detail', function ($scope, $routeParams, $location) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        $scope.title = 'i am otherDetailCtrl page';
    })
    .controller('ctrl.blog', function ($scope, $http, $timeout, $rootScope) {
        // 数据初始化
        $scope.blog = {
            category: 1
        };
        $scope.getList = function () {
            $http.get(host + 'blog/getlist').success(function (res) {
                if (res.length > 2) {
                    $scope.blogList = $.parseJSON(res);
                }
                // 获取列表, 内容渲染完成后执行瀑布流
                $timeout(function () {
                    $('.grid').masonry({
                        // options
                        itemSelector: '.grid-item',
                        columnWidth: '.grid-item'
                    });
                }, 1);
            });
        }
        $scope.getList();

        $scope.showBlogModal = function () {
            $http.get(host + 'category/getList', {
                cache: true
            }).success(function (res) {
                $scope.cateList = $.parseJSON(res);
                if ($scope.cateList) {
                    $scope.blog.category = $scope.cateList[0].id;
                }
            });
        }

        $scope.blogSubmit = function () {
            $scope.blog.author = $rootScope.account.id;
            $http.post(host + 'blog/create', {
                blog: $scope.blog
            }).success(function (res) {
                $('#blogModal').modal('hide');
                $scope.blog = {
                    category: 1
                }
                $scope.getList();
                // 获取列表, 内容渲染完成后执行瀑布流
                $timeout(function () {
                    $('.grid').masonry({
                        // options
                        itemSelector: '.grid-item',
                        columnWidth: '.grid-item'
                    });
                }, 1);
            });
        }
        $scope.title = "所有博客";
    })
    .controller('ctrl.blog.cate', function ($scope, $http, $timeout, $routeParams, $location) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        $http.get(host + 'blog/getList?cid=' + id).success(function (res) {
            if (res.length > 2) {
                $scope.blogList = $.parseJSON(res);
                $scope.title = 'C：' + $scope.blogList[0].cname;
            }
            // 获取列表, 内容渲染完成后执行瀑布流
            $timeout(function () {
                $('.grid').masonry({
                    // options
                    itemSelector: '.grid-item',
                    columnWidth: '.grid-item'
                });
            }, 1);
        });
    })
    .controller('ctrl.blog.author', function ($scope, $http, $timeout, $routeParams, $location) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        $http.get(host + 'blog/getList?uid=' + id).success(function (res) {
            if (res.length > 2) {
                $scope.blogList = $.parseJSON(res);
                $scope.title = 'U：' + $scope.blogList[0].uid;
            }
            // 获取列表, 内容渲染完成后执行瀑布流
            $timeout(function () {
                $('.grid').masonry({
                    // options
                    itemSelector: '.grid-item',
                    columnWidth: '.grid-item'
                });
            }, 1);
        });
    })
    .controller('ctrl.blog.detail', function ($scope, $routeParams, $location, $http, $sce) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        $http.get(host + 'blog/detail?id=' + id).success(function (res) {
            if (res) {
                $scope.blogInfo = $.parseJSON(res);
            } else {

            }
        });
        $scope.title = 'i am otherDetailCtrl page';
    });

angular.module('admin.ctrl', []);
