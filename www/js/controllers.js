angular.module('starter.controllers', [])

    .controller('DashCtrl', ['$scope', '$state', 'socket', '$ionicLoading', function ($scope, $state, socket, $ionicLoading) {
        $scope.username = localStorage.getItem("username");

        $scope.play = function () {
            $state.go('wait');
        };

        $scope.challenge = function () {
            socket.emit('search', 'ok');
            $scope.show();
        };

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Mencari musuh'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        socket.on('halo', function (data) {
            console.log(data);
            $scope.hide();
            $scope.play();
        });

    }]).controller('NavCtrl', ['$scope', '$ionicSideMenuDelegate', '$state', 'socket', function ($scope, $ionicSideMenuDelegate, $state, socket) {
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.logout = function () {
            localStorage.setItem("username", "");
            localStorage.setItem("password", "");
            socket.emit('logout');
            $state.go('login');
        };
    }])
    .controller('CategoryCtrl', ['$scope', 'CategoryQuestion', '$state', 'socket', '$ionicLoading', function ($scope, CategoryQuestion, $state, socket, $ionicLoading) {
        $scope.categories = CategoryQuestion.all();
        $scope.play = function () {
            $state.go('wait');
        };

        $scope.search = function () {
            socket.emit('search', 'ok');
            $scope.show();
        };

        $scope.show = function () {
            $ionicLoading.show({
                template: 'Mencari musuh'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        socket.on('halo', function (data) {
            console.log(data);
            $scope.hide();
            $scope.play();
        });

    }])
    .controller('PlayCtrl', ['$scope', 'socket', '$timeout', '$ionicModal', function ($scope, socket, $timeout, $ionicModal) {
        socket.emit('ready', 'ok');
        $scope.isShift = false;
        $scope.opponentAct = '';
        var tipeUser = '';
        socket.on('ready other', function () {
            socket.emit('all ready', 'ok');
        });
        socket.on('soal', function (data) {
            $scope.timer = 10;
            $scope.opponentAct = "";
            if (data.user == localStorage.getItem('username')) {
                tipeUser = data.tipe;
                $scope.isShift = true;
            }
            else {
                $scope.isShift = false;
            }
            $scope.soal = data.soal.pertanyaan;
            $scope.onTimeout = function () {
                if ($scope.timer == 0) {
                    if (data.user == localStorage.getItem('username')) {
                        $scope.isShift = false;
                        var data_jawaban = {'username': data.user, 'time': $scope.timer, 'answer': "", 'tipe': data.tipe};
                        socket.emit('answer', data_jawaban);
                    }
                }
                else{
                    $scope.timer--;
                    mytimeout = $timeout($scope.onTimeout, 1000);
                }
            };
            var mytimeout = $timeout($scope.onTimeout, 1000);
            $scope.stop = function () {
                $timeout.cancel(mytimeout);
            }
        });
        $scope.jawab = function (userAnswer) {
            var data_jawaban = {'username': localStorage.getItem("username"), 'time': $scope.timer, 'answer': userAnswer, 'tipe': tipeUser};
            $scope.isShift = false;
            socket.emit('answer', data_jawaban);
            $scope.userAnswer = '';
        };

        socket.on('other answer', function (data) {
            console.log(data);
            socket.emit('answer', data);
        });

        socket.on('result answered', function (data) {
            $scope.opponentAct = data.username + ' menjawab ' + data.answer;
        });

        $scope.isTyping = function (userAnswer) {
            if (userAnswer.length > 1) {
                socket.emit('typing', localStorage.getItem('username'));
            }
            else {
                socket.emit('stop typing', localStorage.getItem('username'));
            }
        };

        socket.on('typing', function (data) {
            console.log(data);
            $scope.opponentAct = data + ' sedang mengetik';
        });

        socket.on('stop typing', function (data) {
            $scope.opponentAct = "";
        });
        socket.on('timeout', function(data){
           $scope.opponentAct = 'waktu habis! '+data+' tidak menjawab';
        });

        $scope.images = [];

        $scope.loadImages = function () {
            for (var i = 0; i < 16; i++) {
                $scope.images.push({id: i, src: "http://placehold.it/50x50"});
            }
        };

        $ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });

    }])

    .controller('WaitCtrl', ['$scope', 'socket', '$timeout', '$state', function ($scope, socket, $timeout, $state) {
        $scope.timer = 10;
        socket.emit('ready wait', 'ok');
        socket.on('ready wait all', function (data) {
            $scope.username = localStorage.getItem("username");
            $scope.nama_musuh = data;
            $scope.onTimeout = function () {
                $scope.timer--;
                mytimeout = $timeout($scope.onTimeout, 1000);
                if ($scope.timer == 0) {
                    $state.go('play');
                }
            };
            var mytimeout = $timeout($scope.onTimeout, 1000);
            $scope.stop = function () {
                $timeout.cancel(mytimeout);
            }
        });

    }])

    .controller('LoginCtrl', ['$scope', 'LoginService', '$ionicPopup', '$state', 'socket', function ($scope, LoginService, $ionicPopup, $state, socket) {
        if (localStorage.getItem("username") != "") {
            LoginService.loginUser(localStorage.getItem("username"), localStorage.getItem("password")).success(function () {
                socket.emit('successlogin', {  username: localStorage.getItem("username")});
                $state.go('tab.dash');
            }).error(function () {
                $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
                localStorage.setItem("username", "");
                localStorage.setItem("password", "");
            });
        }
        $scope.data = {};

        $scope.login = function () {
            $scope.template = '';
            LoginService.loginUser($scope.data.username, $scope.data.password).success(function () {
                localStorage.setItem("username", $scope.data.username);
                localStorage.setItem("password", $scope.data.password);
                socket.emit('successlogin', {  username: localStorage.getItem("username")});
                $state.go('tab.dash');
            }).error(function (data) {
                console.log(data);
                if (data == '0') {
                    $scope.template = 'Terjadi kesalahan koneksi';
                }
                else if (data == '1') {
                    $scope.template = 'Username atau password salah';
                }
                $ionicPopup.alert({
                    title: 'Login failed!',
                    template: $scope.template
                });
                localStorage.setItem("username", "");
                localStorage.setItem("password", "");
            });
        }
    }])
    .controller('ProfileCtrl', function ($scope) {
        $scope.posts = [];

        for (var i = 0; i < 7; i++) {
            // Fake a date
            var date = (+new Date) - (i * 1000 * 60 * 60);
            $scope.posts.push({
                created_at: date,
                text: 'Doing a bit of ' + ((Math.floor(Math.random() * 2) === 1) ? 'that' : 'this')
            });
        }
    })
;
