// var url = 'http://172.21.13.64:3000/';
//var url = 'http://127.0.0.1:3000';
//var url = 'http://10.34.241.45:3000';
var url = 'http://192.168.1.100:3000';

//var url = 'http://cerdascermat.herokuapp.com';
angular.module('starter.services', [])
    .factory('socket', ['$rootScope', function ($rootScope) {
        //var socket = io.connect("https://cerdascermat.herokuapp.com:443");
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
    .service('History', function ($http) {
        return {
            get: function (uname) {
                var ress = [];
                $http.get(url + '/api/match/u/' + uname).success(function (response) {
                    ress = response;
                    console.log(ress);
                    return ress;

                }).error(function (err) {
                    ress = 'error : ' + err;
                    return ress;
                });
                console.log(ress);
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
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };
                console.log(promise)
                return promise;
            },
            daftarUser: function (name, pw, ava) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                var data = {'username': name, 'password': pw, 'avatar': ava}; //192.168.43.107 //192.168.1.204
                $http.post(url + '/api/user/daftar', data).success(function (response) {
                    if (response == 1) {
                        deferred.resolve('Welcome ' + name + '!');
                    }
                    else {
                        alert('gagal');
                        deferred.reject('1');
                    }
                }).error(function (err) {
                    alert('error');
                    deferred.reject('0');
                });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };
                console.log(promise);
                return promise;
            }
        }
    })
    .service('URL', function () {
        return {
            get: function () {
                return url;
            }
        }
    })
;
