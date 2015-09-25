// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .filter('relativets', function () {
        return function (value) {
            var now = new Date();
            var diff = now - value;

            // ms units
            var second = 1000;
            var minute = second * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var year = day * 365;
            //var month = day * 30;

            var unit = day;
            var unitStr = 'd';
            if (diff > year) {
                unit = year;
                unitStr = 'y';
            } else if (diff > day) {
                unit = day;
                unitStr = 'd';
            } else if (diff > hour) {
                unit = hour;
                unitStr = 'h';
            } else if (diff > minute) {
                unit = minute;
                unitStr = 'm';
            } else {
                unit = second;
                unitStr = 's';
            }

            var amt = Math.ceil(diff / unit);
            return amt + '' + unitStr;
        }
    })

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('app', {
                url: "/app",
                views: {
                    'tab-app': {
                        templateUrl: "templates/menu.html"
                    }
                }
            })
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller: 'DashCtrl'
            })


            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html'
                    }
                }
            })

            .state('tab.history', {
                url: '/history',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-history.html',
                        controller: 'HistoryCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            }).state('login', {
                url: '/login',
                cache: false,
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    })
    .directive('focusMe', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                $timeout(function () {
                    element[0].focus();
                    //if(ionic.platform.isAndroid()){
                    //    cordova.plugins.Keyboard.show();
                    //}
                }, 150);
            }
        };
    })
    .directive('master', function () { //declaration; identifier master
        function link(scope, element, attrs) { //scope we are in, element we are bound to, attrs of that element
            scope.$watch(function () { //watch any changes to our element
                scope.style = { //scope variable style, shared with our controller
                    height: element[0].offsetWidth + 'px'  //set the height in style to our elements height
                    //width:element[0].offsetWidth+'px' //same with width
                };
            });
        }

        return {
            restrict: 'AE', //describes how we can assign an element to our directive in this case like <div master></div
            link: link // the function to link to our element
        };
    })
    .directive('kepala', function () {
        function link(scope, element, attrs) {
            scope.$watch(function () {
                scope.timerStyle = {
                    'margin-top': (element[0].offsetHeight * -1) + 'px',
                    'min-height': element[0].offsetHeight + 'px'
                };
            });
        }

        return {
            restrict: 'AE',
            link: link
        };
    })
    .directive('timer', function () {
        function link(scope, element, attrs) {
            scope.$watch(function () {
                if (element[0].offsetWidth > element[0].offsetHeight) {
                    scope.hurufTimer = {
                        'height': element[0].offsetWidth + 'px',
                        'line-height':element[0].offsetWidth + 'px'
                    };
                }
                else if (element[0].offsetWidth < element[0].offsetHeight) {
                    scope.hurufTimer = {
                        'width': element[0].offsetHeight + 'px',
                        'line-height':element[0].offsetHeight + 'px'
                    };
                }
            });
        }

        return {
            restrict: 'AE',
            link: link
        };
    })
    .directive('pre-play', function(){
      return {
        restrict : 'AE',
        templateUrl: 'templates/pre-play.html'
      }
    })
;
