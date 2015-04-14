angular.module('starter.controllers', [])

    .controller('DashCtrl', ['$scope', '$state', 'socket','$ionicLoading', function ($scope,$state, socket, $ionicLoading) {
        $scope.username = localStorage.getItem("username");

        $scope.play = function(){
            $state.go('wait');
        };

        $scope.challenge = function(){
            socket.emit('search', 'ok');
            $scope.show();
        };

        $scope.show = function() {
            $ionicLoading.show({
                template: 'Mencari musuh'
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };

        socket.on('halo', function (data) {
            console.log(data);
            $scope.hide();
            $scope.play();
        });

    }]).controller('NavCtrl', ['$scope', '$ionicSideMenuDelegate', '$state', 'socket', function($scope, $ionicSideMenuDelegate, $state, socket) {
        $scope.showMenu = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.showRightMenu = function () {
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.logout = function(){
            localStorage.setItem("username", "");
            localStorage.setItem("password", "");
            socket.emit('logout');
            $state.go('login');
        };
    }])
    .controller('CategoryCtrl',['$scope', 'CategoryQuestion','$state', 'socket', '$ionicLoading', function($scope, CategoryQuestion,$state, socket, $ionicLoading){
        $scope.categories = CategoryQuestion.all();
        $scope.play = function(){
            $state.go('wait');
        };

        $scope.search = function(){
            socket.emit('search', 'ok');
            $scope.show();
        };

        $scope.show = function() {
            $ionicLoading.show({
                template: 'Mencari musuh'
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };

        socket.on('halo', function (data) {
            console.log(data);
            $scope.hide();
            $scope.play();
        });

    }])
    .controller('PlayCtrl',['$scope', 'socket', '$timeout', function($scope, socket, $timeout){
        socket.emit('ready', 'ok');
        socket.on('ready other', function(){
            socket.emit('all ready', 'ok');
        });
        socket.on('soal', function(data){
            $scope.soal = data;
        });
        $scope.jawab = function(userAnswer){
            var data_jawaban = {'username': localStorage.getItem("username"), 'answer': userAnswer}
            socket.emit('answer', data_jawaban);
            $scope.userAnswer = '';
        };

        socket.on('other answer', function(data){ console.log(data);
            socket.emit('answer', data);
        });

        socket.on('result answered', function(data){
            $scope.resultMessage = data.username +' menjawab '+data.answer;
        });

    }])

    .controller('WaitCtrl', ['$scope', 'socket', '$timeout', '$state', function($scope, socket, $timeout, $state){
        $scope.timer = 10;
        socket.emit('ready wait', 'ok');
        socket.on('ready wait all', function(data){
            $scope.username = localStorage.getItem("username");
            $scope.nama_musuh = data;
            $scope.onTimeout = function(){
                $scope.timer--;
                mytimeout = $timeout($scope.onTimeout,1000);
                if($scope.timer == 0) {
                    $state.go('play');
                }
            }
            var mytimeout = $timeout($scope.onTimeout,1000);
            $scope.stop = function(){
                $timeout.cancel(mytimeout);
            }
        });

    }])

    .controller('PlayCtrl1', function($scope){
        getNewNumber();
        $scope.userNumber;
        $scope.score = 0;
        $scope.getFocus = true;
        $scope.resultMessage = 'Start';

        $scope.calculate = function () {
            var answer = this.number * this.number;
            if (answer == this.userNumber) {
                this.score++;
                this.resultMessage = 'You got it!'
                $scope.success = "success";
            } else {
                this.resultMessage = "It is " + answer;
                $scope.success = "failure";
            }
            getNewNumber();
            this.userNumber = '';
            this.getFocus = true;
        };

        function getNewNumber() {
            $scope.number = Math.floor((Math.random() * 9));
        };
    })

    .controller('LoginCtrl', ['$scope', 'LoginService', '$ionicPopup', '$state', 'socket', function ($scope, LoginService, $ionicPopup, $state, socket) {
        if(localStorage.getItem("username") != ""){
            LoginService.loginUser(localStorage.getItem("username"), localStorage.getItem("password")).success(function (data) {
                socket.emit('successlogin', {  username:localStorage.getItem("username")});
                $state.go('tab.dash');
            }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
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
            LoginService.loginUser($scope.data.username, $scope.data.password).success(function (data) {
                localStorage.setItem("username", $scope.data.username);
                localStorage.setItem("password", $scope.data.password);
                socket.emit('successlogin', {  username:localStorage.getItem("username")});
                $state.go('tab.dash');
            }).error(function (data) { console.log(data);
                if(data == '0'){
                    $scope.template = 'Terjadi kesalahan koneksi';
                }
                else if(data == '1'){
                    $scope.template = 'Username atau password salah';
                }
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: $scope.template
                });
                localStorage.setItem("username", "");
                localStorage.setItem("password", "");
            });
        }
    }])
    .controller('ProfileCtrl', function($scope) {
        $scope.posts = [];

        for(var i = 0; i < 7; i++) {
            // Fake a date
            var date = (+new Date) - (i * 1000 * 60 * 60);
            $scope.posts.push({
                created_at: date,
                text: 'Doing a bit of ' + ((Math.floor(Math.random() * 2) === 1) ? 'that' : 'this')
            });
        }
    })
;
