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
            var month = day * 30;

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
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('category', {
                url: '/category',
                templateUrl: 'templates/category.html',
                controller: 'CategoryCtrl'
            })
            .state('play', {
                url: '/play',
                templateUrl: 'templates/play.html',
                controller: 'PlayCtrl'
            })
            .state('wait', {
                url: '/waiting',
                templateUrl: 'templates/waiting.html',
                controller: 'WaitCtrl'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
