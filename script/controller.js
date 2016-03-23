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
    .controller('ctrl.signin', ['$scope', '$rootScope', '$cookieStore', '$timeout', '$location', 'User', function ($scope, $rootScope, $cookieStore, $timeout, $location, User) {
        $rootScope.account = $cookieStore.get('user');
        $scope.user = undefined;
        $scope.submit = function () {
            $scope.loading = true;
            User.sign('signin', $scope.user, function (res) {
                if (res.status) {
                    $('#signinModal').modal('hide');
                    $timeout(function () {
                        $cookieStore.put('user', res.user);
                        $rootScope.account = $cookieStore.get('user');
                        // 刷新视图
                        $location.path($rootScope.path + '/');
                    }, 1000);
                } else {
                    console.log(res.msg);
                }
                $scope.loading = false;
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
    .controller('ctrl.movie', function ($scope, Movie, $rootScope) {
        $scope.movieApi = '请选择';
        $scope.getApi = function () {
            $scope.loading = true;
            Movie.getApi($scope.name, function (res) {
                if (res.data !== undefined) {
                    $scope.movies = res.data.movie;
                    $scope.movies.num = res.data.num;
                }
                $scope.loading = false;
            });
        }
        $scope.selectMovie = function (movie) {
            $scope.movie = $.parseJSON(movie);
        }
        $scope.submit = function () {
            $scope.movie.publisher = $rootScope.account.id;
            // 整理演员字符串
            var actorForm = $scope.movie.actor;
            var actor = [];
            for (var i = 0; i < actorForm.length; i++) {
                actor.push(actorForm[i].trim());
            }
            $scope.movie.actor = actor.join('，');
            Movie.create({
                movie: $scope.movie,
                review: $scope.review
            }, function (res) {
                $('#movieModal').modal('hide');
                // 还原表单
                $scope.movie = {};

                // 添加数据到列表，并移除最后一条记录
                $scope.movieList.pop();
                $scope.movieList.unshift(res);

            });
        };

        $scope.page = 0;

        function getList() {
            var uid = null;
            if ($rootScope.account) {
                uid = $rootScope.account.id;
            };

            Movie.getList($scope.page, uid, function (res) {
                $scope.movieList = res.mlist;
                $scope.movieCount = res.count;

                var pageNum = 6;
                var pageCount = $scope.pageCount = ($scope.movieCount % pageNum == 0) ? ($scope.movieCount / pageNum) : (parseInt($scope.movieCount / pageNum) + 1);

                // 分页处理
                var pager = [];
                for (var i = 0; i < pageCount; i++) {
                    pager.push(i);
                }
                if ($scope.pager === undefined || $scope.page < 3) {
                    // 初始(1-5)页
                    $scope.pager = pager.slice(0, 5);
                } else if (pager.length - $scope.page < 3) {
                    // 总页数-当前页码<3，即没有更多页了，截取页码表的最后5个记录
                    $scope.pager = pager.slice(-5);
                } else if ($scope.page >= 3) {
                    // 页码到达第3页以后，默认使当前页 居中显示
                    $scope.pager = pager.slice(($scope.page - 2), ($scope.page + 3));
                }
            });
        }

        $scope.changePage = function (p) {
            $scope.page = p;
        };

        $scope.$watch('page', function () {
            getList();
        });

    })
    .controller('ctrl.movie.detail', function ($scope, $rootScope, $routeParams, $location, Movie, MovieReview) {
        var id = $routeParams.id;
        if (id == 0) {
            $location.path('/other');
        };

        var uid = undefined;
        if ($rootScope.account) {
            uid = $rootScope.account.id;
        };

        // 查询电影详情，影评，及当前用户影评
        Movie.detail(id, uid, function (res) {
            $scope.movie = res.movie;
            $scope.reviews = res.reviews;
            $scope.review = res.userReview;
            if ($scope.review) {
                $scope.review.content = $scope.review.content.replace(/<br\/>/ig, "\n");
            };
            $scope.slotLimit = (res.movie.slot.length > 100) ? 100 : res.slot.length;
        });

        $scope.submit = function () {
            var model = {
                score: $scope.review.score,
                content: $scope.review.content.replace(/\n/g, "<br/>")
            };
            if ($scope.review.id) {
                model.id = $scope.review.id;
                MovieReview.edit(model, function (res) {
                    $('#reviewModal').modal('hide');
                });
            } else {
                model.writer = $rootScope.account.id;
                model.movie = $scope.movie.id;
                MovieReview.create(model, function (res) {
                    $('#reviewModal').modal('hide');
                });
            }
        };

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
            $scope.loading = true;

            Blog.getList(null, $scope.page, function (res) {
                Blog.createItem(res);
                $scope.loading = false;
                if (res.length == 0) {
                    $scope.hasMoreBlogs = false;
                    $scope.loading = true;
                    $scope.msg = "没有更多内容了！"
                }
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