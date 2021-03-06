 // var host = "http://localhost/ansux/1/index.php/blogs/";
 var host = "http://ansux.96.lt/blog/index.php/blogs/";

 angular.module('app.service', [])
   .factory('User', ['$http', '$cookieStore', '$rootScope',function($http, $cookieStore, $rootScope) {
     return {
       sign: function(action, model, cb) {
         $http.post(host + 'user/' + action, {
           user: model
         }).then(function(res) {
           cb(JSON.parse(res.data));
         });
       }
     };
   }])
   .factory('Category', ['$http',function($http) {
     return {
       getList: function(cb) {
         $http.get(host + 'category/getList', {
           cache: true
         }).then(function(res) {
           cb(JSON.parse(res.data));
         });
       }
     };
   }])
   .factory('Blog', ['$http',function($http) {
     return {
       create: function(model, cb) {
         $http.post(host + 'blog/create', {
           blog: model
         }).then(function(res) {
           cb(JSON.parse(res.data));
         });
       },
       getList: function(query, page, cb) {
         var queryString = '';
         if (query !== null) {
           queryString = '?' + query.action + '=' + query.id + '&page=' + page;
         } else {
           queryString += '?page=' + page;
         }

         $http.get(host + 'blog/getlist' + queryString).then(function(res) {
           cb(JSON.parse(res.data));
         });
       },
       detail: function(id, cb) {
         $http.get(host + 'blog/detail?id=' + id).success(function(res) {
           cb(JSON.parse(res));
         });
       },
       createItem: function(blog) {
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
           $grid.imagesLoaded().progress(function() {
             $grid.masonry('layout');
           });
           $grid.append($items).masonry('appended', $items);
         }
       }
     };
   }])
   .factory('Movie', ['$http',function($http) {
     return {
       getApi: function(name, cb) {
         $http.get(host + 'movie/api?name=' + name).then(function(res) {
           cb(res.data);
         });
       },
       create: function(model, cb) {

         // 整理演员字符串
         var actorForm = model.movie.actor;
         var actor = [];

         if (actorForm.constructor === Array) {
           for (var i = 0; i < actorForm.length; i++) {
             actor.push(actorForm[i].trim());
           }
         } else if (actorForm.constructor === String) {
           var tempArr = actorForm.replace(/,/g, '，').split('，');
           for (var j = 0; j < tempArr.length; j++) {
             actor.push(tempArr[j].trim());
           }
         }

         model.movie.actor = actor.join('，');

         if (model.review) {
           if (model.review.content) {
             model.review.content = model.review.content.replace(/\n/g, "<br/>");
           }
         }
         $http.post(host + 'movie/create', {
           movie: model.movie,
           review: model.review
         }).then(function(res) {
           cb(JSON.parse(res.data));
         });
       },
       getList: function(page, uid, cb) {
         var queryString = 'movie/getlist?page=' + page;
         if (!uid) {
           queryString += '&uid=' + uid;
         }
         $http.get(host + queryString).then(function(res) {
           cb(JSON.parse(res.data));
         });
       },
       detail: function(id, uid, cb) {
         var queryString = '?id=' + id;
         if (uid !== undefined) {
           queryString += ('&uid=' + uid);
         }

         $http.get(host + 'movie/detail' + queryString).then(function(res) {
           cb(JSON.parse(res.data));
         });
       }
     };
   }])
   .factory('MovieReview', ['$http',function($http) {
     return {
       create: function(model, cb) {
         $http.post(host + 'MovieReview/create', {
           review: model
         }).then(function(res) {
           cb(res);
         });
       },
       edit: function(model, cb) {
         $http.post(host + 'MovieReview/edit', {
           review: model
         }).then(function(res) {
           cb(res);
         });
       }
     };
   }])
   .factory('Zan', ['$http',function($http) {
     return {
       save: function(model, cb) {
         $http.post(host + 'Zan/Create', {
           zan: model
         }).then(function(res) {
           cb(JSON.parse(res.data));
         });
       }
     };
   }])
   .factory('Song', ['$http',function($http) {
     return {
       getList: function(page, cb) {
         $http.get(host + 'song/getList?page=' + page).success(function(res) {
           cb(JSON.parse(res));
         });
       }
     };
   }])
   .factory('Tags', ['$http',function($http) {
     return {
       getList: function(cb) {
         $http.get(host + 'playlist/GetTagsList').success(function(res) {
           cb(JSON.parse(res));
         });
       }
     };
   }])
   .factory('Playlist', ['$http',function($http) {
     return {
       getList: function(cb) {
         $http.get(host + 'playlist/getlist').success(function(res) {
           cb(JSON.parse(res));
         });
       },
       create: function(model, cb) {
         $http.post(host + 'playlist/create', {
           playlist: model
         }).success(function(res) {
           cb(JSON.parse(res));
         });
       },
       detail: function(id, cb) {
         $http.get(host + 'playlist/detail?id=' + id).success(function(res) {
           cb(JSON.parse(res));
         });
       },
       updateSongs: function(sid, pid, action, cb) {
         $http.post(host + 'playlist/updateSongs', {
           sid: sid,
           pid: pid,
           action: action
         }).success(function(res) {
           cb(JSON.parse(res));
         });
       }
     };
   }]);
