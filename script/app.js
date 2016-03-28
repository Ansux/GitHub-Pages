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
        .when('/music/pl', {
            controller: 'ctrl.music.pl',
            templateUrl: 'views/music-pl.html'
        })
        .when('/music/pl/:id', {
            controller: 'ctrl.music.pl.detail',
            templateUrl: 'views/music-pl-detail.html'
        })
        .when('/music/sl', {
            controller: 'ctrl.music.sl',
            templateUrl: 'views/music-sl.html'
        })
        .when('/music/song/:id', {
            controller: 'ctrl.music.s.detail',
            templateUrl: 'views/music-s-detail.html'
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

app.run(['$rootScope', '$cookieStore', '$interval', '$timeout', '$location', '$document', 'Playlist', function ($rootScope, $cookieStore, $interval, $timeout, $location, $document, Playlist) {
    $rootScope.$on('$routeChangeSuccess', function (newV) {
        var path = $rootScope.path = $location.path();
        var lis = $('.navbar-nav').children();
        $(lis).removeClass('active');

        if (path.indexOf('/music') >= 0) {
            $(lis[1]).addClass('active');
        } else if (path.indexOf('/movie') >= 0) {
            $(lis[2]).addClass('active');
        } else if (path.indexOf('/blog') >= 0) {
            $(lis[3]).addClass('active');
        } else {
            $(lis[0]).addClass('active');
        }
    });

    // 歌单，播放源，播放状态
    Playlist.getList(function (res) {
        $rootScope.playlists = res;
        // 当前歌曲初始化
        if ($rootScope.playlist === undefined) {
            $rootScope.playlist = $rootScope.playlists[0];
            Playlist.detail($rootScope.playlist.id, function (res) {
                $rootScope.songList = res.songList;
                $rootScope.nowSong = $rootScope.songList[0];
            });
        };
    });

    $rootScope.audio = document.getElementById('audio');
    $rootScope.isPaused = $rootScope.audio.paused;
    if ($cookieStore.get('volume')) {
        $rootScope.audio.volume = $cookieStore.get('volume');
    } else {
        $rootScope.audio.volume = 0.6;
    }

    // 播放器定时刷新
    if ($rootScope.isPaused) {
        (function () {
            $interval(function () {
                var audio = document.getElementById('audio');
                if (audio.ended) {
                    $rootScope.player.next();
                }
            }, 1000);
        })();
    };

    // 定义音乐播放器-控制操作
    $rootScope.player = {
        play: function () {
            $rootScope.audio.play();
            $rootScope.isPaused = false;
            $rootScope.player.update();
        },
        pause: function () {
            $rootScope.audio.pause();
            $rootScope.isPaused = true;
            $rootScope.player.update();
        },
        toggle: function () {
            if ($rootScope.isPaused) {
                $rootScope.player.play();
            } else {
                $rootScope.player.pause();
            }
        },
        changeSong: function (song) {
            $rootScope.nowSong = song;
            $rootScope.player.play();
        },
        pre: function () {
            var id = $rootScope.nowSong.id;
            var length = $rootScope.songList.length;
            angular.forEach($rootScope.songList, function (v, k) {
                if (v.id == id) {
                    if (k == 0) {
                        $rootScope.nowSong = $rootScope.songList[length - 1];
                    } else {
                        $rootScope.nowSong = $rootScope.songList[k - 1];
                    }
                    if ($rootScope.isPaused) {
                        $rootScope.player.pause();
                    } else {
                        $rootScope.player.play();
                    }
                }
            });

        },
        next: function () {
            var id = $rootScope.nowSong.id;
            var length = $rootScope.songList.length;
            angular.forEach($rootScope.songList, function (v, k) {
                if (v.id == id) {
                    if (k == (length - 1)) {
                        $rootScope.nowSong = $rootScope.songList[0];
                    } else {
                        $rootScope.nowSong = $rootScope.songList[k + 1];
                    }
                }
            });
        },
        update: function () {
            $timeout(function () {
                var audio = document.getElementById('audio');
            });
        }
    };

    // 监听当前歌曲变化
    $rootScope.$watch('nowSong', function (nv, ov, scope) {
        if ($rootScope.nowSong != undefined) {
            $rootScope.audio.setAttribute("src", 'http://m2.music.126.net/' + $rootScope.nowSong.mp3url);
        }
        if ($rootScope.isPaused) {
            $rootScope.player.pause();
        } else {
            $rootScope.player.play();
        }
    });

    // 监听键盘事件
    $document.bind("keypress", function (event) {
        if (event.keyCode == 32) {
            if ($rootScope.isPaused) {
                $rootScope.player.play();
            } else {
                $rootScope.player.pause();
            }
        }
    });
}]);

app.controller('ctrl.nav', ['$scope', '$rootScope', '$cookieStore', '$location', function ($scope, $rootScope, $cookieStore, $location) {
    $scope.signout = function () {
        $cookieStore.remove('user');
        $rootScope.account = $cookieStore.get('user');
        // 刷新视图
        $location.path($rootScope.path + '/');
    }
}]);

app.filter('toStrusted', ['$sce', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    }
}]);

app.filter('pagefilter', function () {
    return function (pager, page) {
        return pager.push(20);
    };
});

app.filter('formatTime', [
    function () {
        return function (input) {
            input = parseInt(input) || 0;
            var min = 0;
            var sec = 0;
            if (input > 60) {
                min = parseInt(input / 60);
                sec = input - 60 * min;
                min = min >= 10 ? min : '0' + min;
                sec = sec >= 10 ? sec : '0' + sec;
            } else {
                min = '00';
                sec = input >= 10 ? input : '0' + input;
            }
            return min + ':' + sec;
        }
    }
]);

app.filter('timestamp', function () {
    return function (input) {
        input = input || "";
        return new Date(input.replace(/-/g, '/'));
    }
});

app.filter('add0', function () {
    return function (input) {
        input = input || 0;
        if (input < 10) {
            return "0" + input.toString();
        }
        return input;
    }
});