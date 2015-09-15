// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .filter('relativets', function() {
        return function(value) {
            var now = new Date();
            var diff = now - value;

            // ms units
            var second = 1000;
            var minute = second * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var year =  day * 365;
            //var month = day * 30;

            var unit = day;
            var unitStr = 'd';
            if(diff > year) {
                unit = year;
                unitStr = 'y';
            } else if(diff > day) {
                unit = day;
                unitStr = 'd';
            } else if(diff > hour) {
                unit = hour;
                unitStr = 'h';
            } else if(diff > minute) {
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
                templateUrl: "templates/tabs.html"
            })


            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.friends', {
                url: '/friends',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/tab-friends.html',
                        controller: 'FriendsCtrl'
                    }
                }
            })
            .state('tab.friend-detail', {
                url: '/friend/:friendId',
                views: {
                    'tab-friends': {
                        templateUrl: 'templates/friend-detail.html',
                        controller: 'FriendDetailCtrl'
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
            .state('category', {
                url: '/category',
                templateUrl: 'templates/category.html',
                controller: 'CategoryCtrl'
            })
            .state('got-opp', {
                url: '/got-opp',
                templateUrl: 'templates/got-opponent.html',
                controller: 'GotOppCtrl'
            })
            .state('pre-babak-1', {
                url: '/pre-babak-1',
                cache: false,
                templateUrl: 'templates/pre-babak-1.html',
                controller: 'PreBabak1Ctrl'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            })
            .state('babak-1', {
                url: '/babak-1',
                cache: false,
                templateUrl: 'templates/babak-1.html',
                controller: 'PlayBabak1Ctrl'
            })
            .state('babak-2', {
                url:'/babak-2',
                cache: false,
                templateUrl: 'templates/babak-2.html',
                controller: 'PlayBabak2Ctrl'
            })
            .state('babak-3', {
                url: '/babak-3',
                cache: false,
                templateUrl: 'templates/babak-3.html',
                controller: 'PlayBabak3Ctrl'
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
    });
