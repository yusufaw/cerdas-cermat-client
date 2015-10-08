// var url = 'http://172.21.13.64:3000/';
//var url = 'http://127.0.0.1:3000';
//var url = 'http://10.34.241.212:3000';
var url = 'http://192.168.1.100:3000';

//var url = 'https://cerdascermat.heroku.com:3000';
angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('Friends', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var friends = [
            { id: 0, name: 'Scruff McGruff' },
            { id: 1, name: 'G.I. Joe' },
            { id: 2, name: 'Miss Frizzle' },
            { id: 3, name: 'Ash Ketchum' }
        ];

        return {
            all: function () {
                return friends;
            },
            get: function (friendId) {
                // Simple index lookup
                return friends[friendId];
            }
        }
    })

    .factory('socket', ['$rootScope', function ($rootScope) {
        var socket = io.connect(url);

        return {
            on: function (eventName, callback) {
                function wrapper() {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                }

                socket.on(eventName, wrapper);

                return function () {
                    socket.removeListener(eventName, wrapper);
                };
            },

            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }])

    .service('CategoryQuestion', function () {
        var categories = [
            {id: 0, name: 'Pengetahuan Alam', face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'},
            {id: 1, name: 'Matematika', face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'},
            {id: 2, name: 'Pengetahuan Umum', face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'},
            {id: 3, name: 'Bahasa Inggris', face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'},
            {id: 4, name: 'Kewarganegaraan', face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'}
        ];

        return{
            all: function () {
                return categories;
            },
            get: function (categoryId) {
                return categories[categoryId];
            }
        }
    })
    .service('History', function ($http, $rootScope) {
        return {
            get: function (uname) {
                var ress = [];
                $http.get(url + '/api/match/u/'+uname).success(function (response) {
                    ress = response;console.log(ress);
                    return ress;

                }).error(function (err) {
                    ress = 'error : '+err;
                    return ress;
                });console.log(ress);
                return ress;
            }
        }


    })

    .service('LoginService', function ($q, $http, $rootScope) {
        return {
            loginUser: function (name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var data = {'username': name, 'password': pw}; //192.168.43.107 //192.168.1.204
                $http.post(url + '/api/user/login', data).success(function (response) {
                    if (response == 1) {
                        deferred.resolve('Welcome ' + name + '!');
                    }
                    else {
                        deferred.reject('1');
                    }
                }).error(function (err) {
                    deferred.reject('0');
                });

//                if (name == 'user') {
//                    deferred.resolve('Welcome ' + name + '!');
//                } else {
//                    deferred.reject('Wrong credentials.');
//                }
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };console.log(promise)
                return promise;
            }
        }
    })
    .service('URL', function(){
        return{
            get: function () {
                return url;
            }
        }
    })
;
