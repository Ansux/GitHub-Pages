angular.module('app.directives', [])
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