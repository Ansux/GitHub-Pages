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
    .directive('loading', function () {
        return {
            restrict: 'A',
            template: '<div class="loading"><i class="fa fa-spinner fa-spin"></i></div>',
            link: function (scope, ele, attrs, c) {
                console.log(scope);
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