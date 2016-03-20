angular.module('app.ctrls', ['app.service'])
    // 用户注册
    .controller('ctrl.signup', ['$scope', 'User', function ($scope, User) {
        $scope.user = null;
        $scope.submit = function () {
            User.sign('signup', $scope.user, function (res) {
                if (res.status) {
                    $('#signupModal').modal('hide');
                }
            })
        }
    }])
    // 用户登录
    .controller('ctrl.signin', ['$scope', '$rootScope', '$cookieStore', 'User', function ($scope, $rootScope, $cookieStore, User) {
        $rootScope.account = $cookieStore.get('user');
        $scope.user = undefined;
        $scope.submit = function () {
            User.sign('signin', $scope.user, function (res) {
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
    // 首页模块
    .controller('ctrl.home', function ($scope) {
        $scope.title = 'i am home page';
    })
    // 音乐模块
    .controller('ctrl.music', function ($scope) {
        $scope.title = 'i am other page';
    })
    // 音乐详情
    .controller('ctrl.music.detail', function ($scope, $routeParams, $location) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        $scope.title = '音乐详情';
    })
    .controller('ctrl.movie', function ($scope, Movie) {
        $scope.movieApi = '请选择';
        $scope.getApi = function () {
            Movie.getApi($scope.name, function (res) {
                console.log(res);
                $scope.movies = res.data.movie;
                $scope.movies.num = res.data.num;
            });
        }
        $scope.selectMovie = function (movie) {
            $scope.movie = $.parseJSON(movie);
        }
        $scope.submit = function () {
            Movie.create({
                movie: $scope.movie,
                review: $scope.review
            }, function (res) {

            });
        }
    })
    .controller('ctrl.movie.detail', function ($scope, $routeParams, $location) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        $scope.title = '电影详情';
    })
    .controller('ctrl.blog', function ($scope, $rootScope, $timeout, Blog, Category) {
        // 数据初始化
        $scope.blog = {
            category: null
        };

        $scope.page = 0;
        // 获取列表
        function getList() {
            $scope.hasMoreBlogs = true;
            Blog.getList(null, $scope.page, function (res) {
                if (res.length == 0) {
                    $scope.hasMoreBlogs = false;
                }
                Blog.createItem(res);
            })
        };

        $scope.showBlogModal = function () {
            Category.getList(function (res) {
                $scope.cateList = res;
                if ($scope.cateList) {
                    $scope.blog.category = res[0].id;
                }
            });
        }

        $scope.$watch('page', function () {
            getList();
        });

        $scope.blogSubmit = function () {
            $scope.blog.author = $rootScope.account.id;
            Blog.create($scope.blog, function (res) {
                $('#blogModal').modal('hide');
                // 还原表单
                $scope.blog = {
                    category: 1
                };
                // 添加数据到列表
                Blog.createItem(res);
            });
        }
        $scope.title = "所有博客";
    })
    .controller('ctrl.blog.cate', function ($scope, $routeParams, $location, Blog) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }

        Blog.getList({
            action: 'cid',
            id: id
        }, 0, function (res) {
            Blog.createItem(res);
            $scope.title = 'C:' + res[0].cname;
        });
    })
    .controller('ctrl.blog.author', function ($scope, $rootScope, $routeParams, $location, Blog) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }

        Blog.getList({
            action: 'uid',
            id: id
        }, 0, function (res) {
            Blog.createItem(res);
            $scope.title = 'U:' + res[0].uid;
        });
    })
    .controller('ctrl.blog.detail', function ($scope, $routeParams, $location, $sce, Blog) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        }
        Blog.detail(id, function (res) {
            $scope.blogInfo = res;
        });
        $scope.title = '博客详情';
    });

angular.module('admin.ctrl', []);