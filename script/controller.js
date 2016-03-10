var host = "http://localhost/ansux/1/index.php/blogs/";
var postConfig = {
   headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
   },
   transformRequest: function (data) {
      return $.param(data);
   }
};

angular.module('app.ctrl', [])
   .controller('ctrl.signup', ['$scope', '$http', function ($scope, $http) {
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
   }])
   .controller('ctrl.signin', ['$scope', '$rootScope', '$http', '$cookieStore', function ($scope, $rootScope, $http, $cookieStore) {
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

   .controller('ctrl.movie', function ($scope) {
      $scope.title = 'i am other page';
   })
   .controller('ctrl.movie.detail', function ($scope, $routeParams, $location) {
      var id = $routeParams.id;
      if (id == 0) {
         $location.path('/other');
      }
      $scope.title = 'i am otherDetailCtrl page';
   })

   .controller('ctrl.blog', function ($scope, $http, $timeout, $rootScope) {
      $http.get(host + 'blog/getlist').success(function (res) {
         $scope.blogList = $.parseJSON(res);
      });

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
            }, 1000)
         });
      }

      $scope.showBlogModal = function () {
         $http.get(host + 'category/getList').success(function (res) {
            $scope.cateList = $.parseJSON(res);
         });
      }

      $scope.blogSubmit = function () {
         $scope.blog = {
            author: $rootScope.account.id,
            category: '1'
         };
         $http.post(host + 'blog/create', {
            blog: $scope.blog
         }, postConfig).success(function (res) {
            $('#blogModal').modal('hide');
         });
      }
   })
   .controller('ctrl.blog.detail', function ($scope, $routeParams, $location) {
      var id = $routeParams.id;
      if (id == 0) {
         $location.path('/other');
      }
      $scope.title = 'i am otherDetailCtrl page';
   });

angular.module('admin.ctrl', []);