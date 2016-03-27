angular.module('app.directives', ['app.service'])
    .directive('ensureUnique', ['$http', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                ele.on('blur', function () {
                    var filed = attrs.name;
                    var value = c.$modelValue;
                    if (value != undefined && value.length != 0) {
                        $http.post(host + attrs.ensureUnique + '/unique' + filed, {
                            name: value
                        }).success(function (data, status, headers, cfg) {
                            c.$setValidity('unique', $.parseJSON(data));
                        }).error(function (data, status, headers, cfg) {
                            c.$setValidity('unique', false);
                        });
                    }
                });
            }
        };
    }])
    .directive('masonry', function ($timeout) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {

            }
        }
    })
    .directive('scroll', function ($window) {
        return function (scope, element, attrs) {
            angular.element($window).bind('scroll', function (e) {
                if ($(window).scrollTop() >= $(document).height() - $(window).height()) {
                    if (scope.hasMoreBlogs) {
                        scope.page += 1;
                        scope.$apply();
                    }
                }
            })
        }
    })
    .directive('requireLogin', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                var target = attrs.target;
                scope.$watch('account', function () {
                    if ($rootScope.account === undefined) {
                        attrs.$set('data-toggle', 'modal');
                        attrs.$set('data-target', '#signinModal');
                    } else {
                        attrs.$set('data-target', target);
                    }
                });
            }
        }
    })
    .directive('progress', function ($rootScope) {
        return {
            link: function (scope, ele, attrs, ng) {
                var audio = document.getElementById('audio');
                ele.bind('click', function (e) {
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
        }
    })
    .directive('volume', function ($rootScope, $cookieStore) {
        return {
            link: function (scope, ele, attrs) {
                var audio = document.getElementById('audio');
                ele.bind('click', function (e) {
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
        }
    })
    .directive('volumeToggle', function ($rootScope, $cookieStore) {
        return {
            link: function (scope, ele, attrs) {
                ele.bind('click', function (e) {
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
        }
    })
    .directive('zan', function (Zan, $rootScope) {
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
            link: function (scope, ele, attrs, c) {
                ele.on('click', function () {
                    if ($rootScope.account) {
                        var zan = {
                            type: scope.type,
                            objId: scope.model.id,
                            user: $rootScope.account.id
                        };
                        Zan.save(zan, function (res) {
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
        }
    })
    .directive('toolMenu', function () {
        return {
            link: function (scope, ele, attrs, ng) {
                ele.bind('click', function () {
                    console.log(ele[0].parentNode);
                });
            }
        }
    })
    .directive('miniPager', function ($interval) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                pnum: '=',
                page: '=',
                rcount: '='
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
            controller: function ($scope) {},
            link: function (scope, ele, attrs, ng) {
                scope.changePage = function (p) {
                    scope.page = p;
                };
                scope.$watch('rcount', function () {
                    var pageCount = scope.pcount = (scope.rcount % scope.pnum == 0) ? (scope.rcount / scope.pnum) : (parseInt(scope.rcount / scope.pnum) + 1);

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
        }
    })
    .directive('textareaEditor', function () {
        return {
            restrict: 'A',
            link: function (scope, ele, attrs, c) {
                scope.$watch('review.content', function (newValue, oldValue, scope) {
                    console.log(scope);
                    if (scope.review) {}
                });

            }
        }
    })
    .directive('scrollBar', function ($timeout) {
        return {
            link: function (scope, ele, attrs, ng) {
                scope.$watch('songList', function (nv, ov, scope) {
                    var elm = ele[0];
                    var scrollHeight = elm.scrollHeight;
                });
                ele.bind('click', function () {});
            }
        }
    })
    .directive('coverHover', function () {
        return {
            link: function (scope, ele, attrs, ng) {
                ele.bind('mouseover', function () {
                    $(ele[0].children[2]).show();
                });
                ele.bind('mouseleave', function () {
                    $(ele[0].children[2]).hide();
                });
            }
        }
    })
    .directive('contenteditable', function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                } // do nothing if no ng-model
                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };
                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
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