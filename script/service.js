// var host = "http://localhost/ansux/1/index.php/blogs/";
var host = "http://ansux.sinaapp.com/blogs/";

angular.module('app.service', [])
    .factory('User', function ($http, $cookieStore, $rootScope) {
        return {
            sign: function (action, model, cb) {
                $http.post(host + 'user/' + action, {
                    user: model
                }).then(function (res) {
                    cb(JSON.parse(res.data));
                })
            }
        }
    })
    .factory('Category', function ($http) {
        return {
            getList: function (cb) {
                $http.get(host + 'category/getList', {
                    cache: true
                }).then(function (res) {
                    cb(JSON.parse(res.data));
                });
            }
        }
    })
    .factory('Blog', function ($http) {
        return {
            create: function (model, cb) {
                $http.post(host + 'blog/create', {
                    blog: model
                }).then(function (res) {
                    cb(JSON.parse(res.data));
                })
            },
            getList: function (query, page, cb) {
                var queryString = '';
                if (query !== null) {
                    queryString = '?' + query.action + '=' + query.id + '&page=' + page;
                } else {
                    queryString += '?page=' + page;
                }

                $http.get(host + 'blog/getlist' + queryString).then(function (res) {
                    cb(JSON.parse(res.data));
                })
            },
            detail: function (id, cb) {
                $http.get(host + 'blog/detail?id=' + id).success(function (res) {
                    cb(JSON.parse(res));
                });
            },
            createItem: function (blog) {
                if (blog.length === undefined) {
                    addItem(blog);
                } else if (blog.length > 0) {
                    for (var i = 0; i < blog.length; i++) {
                        addItem(blog[i]);
                    }
                }

                function addItem(blog) {
                    var $items = $('<div class="grid-item col-lg-3 col-md-4 col-sm-4 col-xs-6">' +
                        '<div class="thumbnail">' +
                        '<img src="' + blog.thumb + '" alt="">' +
                        '<div class="caption">' +
                        '<h4><a href="#/blog/' + blog.id + '">' + blog.title.substr(0, 20) + '</a></h4>' +
                        '<p><span>' + blog.cname.substr(0, 2) + '</span>' + blog.digest.substr(0, 60) + '...</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                    // init Masonry
                    var $grid = $('.grid').masonry({
                        itemSelector: '.grid-item',
                        columnWidth: '.grid-item'
                    });
                    // layout Masonry after each image loads
                    $grid.imagesLoaded().progress(function () {
                        $grid.masonry('layout');
                    });
                    $grid.append($items).masonry('appended', $items);
                }
            }
        }
    })
    .factory('Movie', function ($http) {
        return {
            getApi: function (name, cb) {
                $http.get(host + 'movie/api?name=' + name).then(function (res) {
                    cb(res.data);
                });
            },
            create: function (model, cb) {
                console.log(model);
                $http.post(host + 'movie/create', {
                    movie: model.movie,
                    review: model.review
                }).then(function (res) {
                    cb(res);
                });
            },
            getList: function (cb) {
                $http.get(host + 'movie/getlist').then(function (res) {
                    cb(res);
                });
            }
        }
    })