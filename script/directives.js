angular.module('app.directives', ['app.service'])
  .directive('siteNav', function() {
    return {
      link: function(scope, ele, attrs, ng) {
        $(ele).children().click(function(e) {
          $(ele).children().click(function() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
          });
        });
      }
    };
  })
  .directive('ensureUnique', ['$http', function($http) {
    return {
      require: 'ngModel',
      link: function(scope, ele, attrs, c) {
        ele.on('blur', function() {
          var filed = attrs.name;
          var value = c.$modelValue;
          if (!value && value.length !== 0) {
            $http.post(host + attrs.ensureUnique + '/unique' + filed, {
              name: value
            }).success(function(data, status, headers, cfg) {
              c.$setValidity('unique', $.parseJSON(data));
            }).error(function(data, status, headers, cfg) {
              c.$setValidity('unique', false);
            });
          }
        });
      }
    };
  }])
  .directive('masonry', ['$timeout',function($timeout) {
    return {
      require: 'ngModel',
      link: function(scope, ele, attrs, c) {

      }
    };
  }])
  .directive('scroll', ['$window',function($window) {
    return function(scope, element, attrs) {
      angular.element($window).bind('scroll', function(e) {
        if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
          if (scope.hasMoreBlogs) {
            scope.page += 1;
            scope.$apply();
          }
        }
      });
    };
  }])
  .directive('requireLogin', ['$rootScope',function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, ngModel) {
        var target = attrs.target;
        scope.$watch('account', function() {
          if ($rootScope.account === undefined) {
            attrs.$set('data-toggle', 'modal');
            attrs.$set('data-target', '#signinModal');
          } else {
            attrs.$set('data-target', target);
          }
        });
      }
    };
  }])
  .directive('progress', ['$rootScope',function($rootScope) {
    return {
      link: function(scope, ele, attrs, ng) {
        var audio = document.getElementById('audio');
        ele.bind('click', function(e) {
          var rect = ele[0].getBoundingClientRect(); //进度条rect
          var beginX = rect.left; //进度条X坐标
          var x = e.clientX; //点击点坐标
          var percent = (x - beginX) / rect.width; //百分比
          percent = percent > 1 ? 1 : percent;
          var duration = scope.audio.duration;
          var currentTime = duration * percent;
          scope.audio.currentTime = currentTime;
          $rootScope.player.update();
        });
      }
    };
  }])
  .directive('volume', ['$rootScope', '$cookieStore',function($rootScope, $cookieStore) {
    return {
      link: function(scope, ele, attrs) {
        var audio = document.getElementById('audio');
        ele.bind('click', function(e) {
          var rect = ele[0].getBoundingClientRect(); //进度条rect
          var beginX = rect.left; //进度条X坐标
          var x = e.clientX; //点击点坐标
          var percent = (x - beginX) / rect.width; //百分比
          percent = percent > 1 ? 1 : percent;
          scope.audio.volume = percent;
          $rootScope.player.update();
          $cookieStore.put('volume', percent);
        });
      }
    };
  }])
  .directive('volumeToggle', ['$rootScope', '$cookieStore',function($rootScope, $cookieStore) {
    return {
      link: function(scope, ele, attrs) {
        ele.bind('click', function(e) {
          if (scope.audio.volume > 0) {
            attrs.$set('original', scope.audio.volume);
            scope.audio.volume = 0;
          } else {
            scope.audio.volume = attrs.original;
          }
          $rootScope.player.update();
          $cookieStore.put('volume', scope.audio.volume);
        });
      }
    };
  }])
  .directive('zan', ['Zan', '$rootScope',function(Zan, $rootScope) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        model: '=',
        type: '='
      },
      template: '<span require-login class="zan" ng-class="{\'has-zan\': model.zan}">' +
        '<i class="fa fa-thumbs-o-up" ng-class="{\'fa-thumbs-up\':model.zan}"></i>' +
        ' {{model.flower}}' +
        '</span>',
      link: function(scope, ele, attrs, c) {
        ele.on('click', function() {
          if ($rootScope.account) {
            var zan = {
              type: scope.type,
              objId: scope.model.id,
              user: $rootScope.account.id
            };
            Zan.save(zan, function(res) {
              if (res.action == "create") {
                scope.model.flower = parseInt(scope.model.flower) + 1;
                scope.model.zan = 1;
              } else if (res.action == "delete") {
                scope.model.flower = parseInt(scope.model.flower) - 1;
                scope.model.zan = null;
              }
            });
          }
        });
      }
    };
  }])
  .directive('toolMenu', function() {
    return {
      link: function(scope, ele, attrs, ng) {
        var toolBar = document.getElementById('addToPL');
        ele.bind('click', function(e) {
          var x = e.clientX;
          var y = e.clientY;
          $(toolBar).show();
          $(toolBar).css('left', x + 5);
          $(toolBar).css('top', y);

          $(toolBar).attr('sid', scope.s.id);

          $(ele[0].parentNode.parentNode).siblings().removeClass('active');
          $(ele[0].parentNode.parentNode).addClass('active');

          return false;
        });
      }
    };
  })
  .directive('sitem', function() {
    return {
      link: function(scope, ele, attrs, ng) {
        var toolBar = document.getElementById('addToPL');

        ele.bind('click', function(e) {
          $(ele).siblings().removeClass('active');
          $(ele).addClass('active');
          $(toolBar).hide();
        });
      }
    };
  })
  .directive('addToPlaylist', ['Playlist',function(Playlist) {
    return {
      link: function(scope, ele, attrs, ng) {
        var toolBar = document.getElementById('addToPL');

        ele.bind('click', function() {
          var sid = $(toolBar).attr('sid');
          var pid = scope.pl.id;

          Playlist.updateSongs(sid, pid, "add", function(res) {
            if (res === 1) {
              $(toolBar).hide();
            }
          });

        });
      }
    };
  }])
  .directive('miniPager', ['$interval',function($interval) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        pnum: '=',
        page: '=',
        rcount: '=',
        source: '='
      },
      template: '<nav class="clearfix">' +
        '<ul class="pagination pagination-sm">' +
        '<li><button ng-disabled="page==0" ng-click="changePage(page-1)" aria-label="Previous">' +
        '<span aria-hidden="true">&laquo;</span>' +
        '</button>' +
        '</li>' +
        '<li ng-class="{\'active\':page==p}" ng-repeat="p in pager"><a ng-click="changePage(p)">{{p+1}}</a></li>' +
        '<li>' +
        '<button ng-disabled="page==(pcount-1)" ng-click="changePage(page+1)" aria-label="Next">' +
        '<span aria-hidden="true">&raquo;</span>' +
        '</button>' +
        '</li>' +
        '</ul>' +
        '<div class="page-count" ng-bind-template="(共{{pcount}}页/{{rcount}}条)"></div>' +
        '</nav>',
      controller: function($scope) {},
      link: function(scope, ele, attrs, ng) {
        scope.changePage = function(p) {
          scope.page = p;
        };
        scope.$watch('source', function() {
          var pageCount = scope.pcount = (scope.rcount % scope.pnum === 0) ? (scope.rcount / scope.pnum) : (parseInt(scope.rcount / scope.pnum) + 1);
          var pager = [];
          for (var i = 0; i < pageCount; i++) {
            pager.push(i);
          }
          if (scope.pager === undefined || scope.page < 3) {
            // 初始(1-5)页
            scope.pager = pager.slice(0, 5);
          } else if (pager.length - scope.page < 3) {
            // 总页数-当前页码<3，即没有更多页了，截取页码表的最后5个记录
            scope.pager = pager.slice(-5);
          } else if (scope.page >= 3) {
            // 页码到达第3页以后，默认使当前页 居中显示
            scope.pager = pager.slice((scope.page - 2), (scope.page + 3));
          }
        });
      }
    };
  }])
  .directive('textareaEditor', function() {
    return {
      restrict: 'A',
      link: function(scope, ele, attrs, c) {
        scope.$watch('review.content', function(newValue, oldValue, scope) {
          console.log(scope);
          if (scope.review) {}
        });

      }
    };
  })
  .directive('scrollBar', ['$timeout',function($timeout) {
    return {
      link: function(scope, ele, attrs, ng) {
        scope.$watch('songList', function(nv, ov, scope) {
          var elm = ele[0];
          var scrollHeight = elm.scrollHeight;
        });
        ele.bind('click', function() {});
      }
    };
  }])
  .directive('roll', ['$interval', '$timeout',function($interval, $timeout) {
    return {
      link: function(scope, ele, attrs, ng) {
        var marqueeVar;
        scope.roll = function() {
          var obj = ele[0].parentNode;
          var obj1 = ele[0].children[0];
          var obj2 = ele[0].children[1];
          // 延迟执行，等待ng渲染完成
          $timeout(function() {
            // 曲目信息内容超出父容器
            if (obj.offsetWidth < obj1.offsetWidth) {
              obj2.innerText = obj1.innerText;
              $interval.cancel(marqueeVar);

              marqueeVar = $interval(function() {
                if (obj2.offsetWidth - (obj.scrollLeft - 60) <= 0) {
                  $interval.cancel(marqueeVar);
                  marqueeVar = undefined;
                  obj.scrollLeft = 0;
                  // 曲目信息循环一圈后，暂停3秒钟后继续执行。
                  setTimeout(function() {
                    scope.roll();
                  }, 3000);
                } else {
                  obj.scrollLeft++;
                }
              }, 20);
            } else {
              $interval.cancel(marqueeVar);
              marqueeVar = undefined;
              obj2.innerText = "";
            }
          });
        };

        // 监听当前曲目
        scope.$watch('nowSong', function() {
          scope.roll();
        });
      }
    };
  }])
  .directive('coverHover', function() {
    return {
      link: function(scope, ele, attrs, ng) {
        ele.bind('mouseover', function() {
          $(ele[0].children[2]).show();
        });
        ele.bind('mouseleave', function() {
          $(ele[0].children[2]).hide();
        });
      }
    };
  })
  .directive('contenteditable', function() {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        } // do nothing if no ng-model
        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html(ngModel.$viewValue || '');
        };
        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$apply(readViewText);
        });
        // No need to initialize, AngularJS will initialize the text based on ng-model attribute
        // Write data to the model
        function readViewText() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if (attrs.stripBr && html === '<br>') {
            html = '';
          }
          ngModel.$setViewValue(html);
        }
      }
    };
  });
