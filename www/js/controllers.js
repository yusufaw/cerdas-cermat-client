angular.module('starter.controllers', [])
    .controller('DashCtrl', ['$scope', '$state', 'socket', '$ionicLoading','$ionicHistory','$rootScope','$ionicModal','$interval','$timeout', function ($scope, $state, socket, $ionicLoading, $ionicHistory, $rootScope, $ionicModal, $interval, $timeout) {
        var stopPrePlay;
        var tipeUser = '';
        var stopTimer1;
        var stopTimerKeBabak2;
        var stopTimerKeBabak3;
        var _idSoal = '';
        var tipeGilir = '';
        var stopTimer2;
        var mandek;
        var stopTimer3;
        $scope.terpilih = [];
        $scope.images = [];
        var noSoal = 0;
        var mandek3;



        var secondPrePlay = 5;
        var time2Babak2 = 5;
        var time2Babak3 = 5;
        var secondBabak1 = 20;
        var secondFight2 = 20;
        var secondAnswer2 = 20;
        var secondFight3 = 10;
        var secondAnswer3 = 10;
        var secondDone = 5;


        $scope.show = [10];
        $scope.button = [3];
        $scope.view = [3];
        $scope.steps = 0;
        $scope.username = localStorage.getItem("username");
        console.log('ini halaman dash');

        socket.on('cek aja', function () {
            alert('cek aja');
        });
        $scope.mypoin = 0;
        socket.emit('ready tab', 'ok');
        socket.on('my data', function (myData) {
            $scope.mypoin = myData.mypoin;
            console.log($scope.mypoin);
        });

        $scope.play = function () {
            //$ionicHistory.nextViewOptions({
            //    disableBack: true
            //});
            //$state.go('pre-babak-1');
            console.log('ready wait on');
            socket.emit('ready wait', 'ok');
        };

        $scope.showKeyboard = function () {
            //$scope.userAnswer = 'hemm';
            //cordova.plugins.Keyboard.show();
            $scope.isHeader = false;
            setButton(2);
            var inp = document.getElementsByTagName('input');
            //inp.focus();
            console.log('panjang : '+inp.length);
        };

        $scope.challenge = function () {
            if (localStorage.getItem("username") == "") {
                socket.emit('logout', 'oyi');
            }
            else {
                socket.emit('search', 'ok');
                $scope.showLoading();
            }
        };

        socket.on('logout', function () {
            $scope.logout();
        });

        $scope.logout = function () {
            $scope.hideLoading();
            $state.go('login');
        };

        $scope.showLoading = function () {
            $ionicLoading.show({
                template: 'Mencari musuh'
            });
        };

        $scope.hideLoading = function () {
            $ionicLoading.hide();
        };

        socket.on('halo', function (data) {
            console.log(data);
            $scope.hideLoading();
            $scope.play();
        });

        function setShow(id){
            for(var i = 0; i < 10; i++){
                if(i == id){
                    $scope.show[i] = true;
                }
                else{
                    $scope.show[i] = false;
                }
            }
        }

        function setButton(id){
            for(var i=0; i < 4; i++){
                if(i==id){
                    $scope.button[i] = true;
                }
                else{
                    $scope.button[i] = false;
                }
            }
        }

        function setView(id){
            for(var i = 0; i < 5; i++){
                if(i == id){
                    $scope.view[i] = true;
                }
                else{
                    $scope.view[i] = false;
                }
            }
        }

        function playTimer(detikan){
            move(detikan)
                .ease('snap')
                .set('opacity', 1)
                .scale(2)
                .duration('0s')
                .end();
            move(detikan)
                .ease('out')
                //.rotate(140)
                .scale(0.1)
                .set('opacity', 0)
                .duration('1s')
                .end();
        }

        socket.on('ready wait other', function (data) {
            socket.emit('all ready wait', 'ok');
            $scope.detail_musuh = {
                'username': data.username,
                'poin': data.poin,
                'poinBabak1': 0,
                'poinBabak2': 0,
                'poinBabak3': 0
            };

            $rootScope.detail_musuh = $scope.detail_musuh;

            $scope.detail_ku = {
                'username': localStorage.getItem("username"),
                'poin': data.poin,
                'poinBabak1': 0,
                'poinBabak2': 0,
                'poinBabak3': 0
            };
            //console.log('musuhku adalah '+$scope.detail_musuh['username']);

            console.log('aku : '+$scope.detail_ku['username']);
            console.log('musuh : '+$scope.detail_musuh['username']);
        });

        socket.on('ready wait all', function (data) {
            $scope.username = localStorage.getItem("username");
            localStorage.setItem('poin babak 1', JSON.stringify({}));
            localStorage.setItem('poin babak 2', JSON.stringify({}));
            $scope.nama_musuh = data.username;
            $scope.poin_musuh = data.poin;
            setShow(0);
            $scope.openModalPlay();
            $scope.goPrePlay();
            $scope.timerPrePlay = secondPrePlay;
        });

        $scope.goPrePlay = function () {
            if (angular.isDefined(stopPrePlay)) return;

            stopPrePlay = $interval(function () {
                if ($scope.timerPrePlay > 0) {
                    $scope.timerPrePlay--;
                    playTimer(document.getElementById('myTimer'));
                }
                else {
                    $scope.startPlay();
                    setShow(1);
                    goBabak3();
                }
            }, 1000);
        };

        socket.on('wis bar', function () {
            $scope.closeModalPlay();
        });

        $scope.startPlay = function () {
            if (angular.isDefined(stopPrePlay)) {
                $interval.cancel(stopPrePlay);
                stopPrePlay = undefined;
            }
        };

        $ionicModal.fromTemplateUrl('templates/modal-pre-play.html', {
            scope: $scope,
            animation: 'scale-in'
        }).then(function (modal) {
            $scope.modalPlay = modal;
        });

        $scope.openModalPlay = function () {
            $scope.modalPlay.show();
        };

        $scope.closeModalPlay = function () {
            $scope.modalPlay.hide();
        };

        function goBabak1(){
            socket.emit('ready babak 1', 'ok');
            $scope.isShift = false;
            $scope.opponentAct = '';
            $scope.userAnswer = '';
            setView(0);
            setButton(0);
        }

        socket.on('ready other babak 1', function () {
            socket.emit('all ready babak 1', 'ok');
        });

        $scope.fightTimer1 = function (data) {
            if (angular.isDefined(stopTimer1)) return;
            stopTimer1 = $interval(function () {
                if ($scope.waktu1 > 0) {
                    $scope.waktu1--;
                    playTimer(document.getElementById('playTimer'));
                } else {
                    if ($scope.isShift) {
                        $scope.isShift = false;
                        var data_jawaban = {
                            'username': data.user,
                            'time': $scope.waktu1,
                            'answer': "",
                            'tipe': data.tipe
                        };
                        socket.emit('answer babak 1', data_jawaban);
                    }
                    $scope.stopFightTimer1();
                }
            }, 1000);
        };

        $scope.stopFightTimer1 = function () {
            if (angular.isDefined(stopTimer1)) {
                $interval.cancel(stopTimer1);
                stopTimer1 = undefined;
            }
        };

        $scope.resetFightTimer1 = function () {
            $scope.waktu1 = secondBabak1;
        };

        //$scope.$on('$destroy', function () {
        //    // Make sure that the interval is destroyed too
        //    $scope.stopFight();
        //});
        socket.on('soal babak 1', function (data) {
            $scope.resetFightTimer1();
            $scope.opponentAct = "";
            $scope.isType = false;
            if (data.user == $scope.detail_ku['username']) {
                tipeUser = data.tipe;
                $scope.isShift = true;
                $scope.textShift = "Giliran Anda, silahkan jawab";
            }
            else {
                $scope.isShift = false;
                $scope.textShift = "Giliran " + data.user + "";
            }
            $scope.fightTimer1(data);
            $scope.soal = data.soal.pertanyaan;
        });

        $scope.jawabBabak1 = function (userAnswer) {
            var data_jawaban = {
                'username': $scope.detail_ku['username'],
                'time': $scope.waktu1,
                'answer': userAnswer,
                'tipe': tipeUser
            };
            $scope.isShift = false;
            socket.emit('answer babak 1', data_jawaban);
            $scope.userAnswer = '';
            $scope.stopFightTimer1();
        };

        socket.on('other answer babak 1', function (data) {
            console.log('menerima jawaban dari ' + data.username + ' ===== send to server');
            socket.emit('answer babak 1', data);
            $scope.stopFightTimer1();
        });

        socket.on('result answered babak 1', function (data) {
            $scope.opponentAct = data.username + ' menjawab ' + data.answer;
            if (data.username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data.poin;
            }
            else {
                $scope.detail_musuh['poin'] = data.poin;
            }

            var x = (data.isbenar == '1')?'. Benar!':'. Salah!';
            $scope.opponentAct =$scope.opponentAct+ x;
        });

        $scope.isTyping = function (userAnswer) {
            if (userAnswer.length > 0) {
                socket.emit('typing', $scope.detail_ku['username']);
            }
            else {
                socket.emit('stop typing', $scope.detail_ku['username']);
            }
        };

        socket.on('typing', function (data) {
            $scope.isType = true;
            $scope.opponentAct = data + ' sedang mengetik';
        });

        socket.on('stop typing', function () {
            $scope.opponentAct = "";
            $scope.isType = false;
        });

        socket.on('timeout', function (data) {
            $scope.opponentAct = 'waktu habis! ' + data + ' tidak menjawab';
        });

        socket.on('babak 1 done', function (data) {
            setShow(2);
            console.log('aku : '+$scope.detail_ku['username']);
            console.log('musuh : '+$scope.detail_musuh['username']);
            $scope.babakX = 'Babak 2';
            $scope.textAboutBabak = 'Pada babak ini akan ada 16 kotak dengan tiap kotak berisi pertanyaan yang berbeda. Anda harus memilih salah satu kotak untuk kemudian menjawab pertanyaan di dalamnya. Poin yang dihitung adalah banyaknya kotak yang terhubung.';
            if(data[0].username == $scope.detail_ku['username']){
                $scope.detail_ku['poinBabak1'] = data[0].poin;
                $scope.detail_musuh['poinBabak1'] = data[1].poin;
            }
            else{
                $scope.detail_ku['poinBabak1'] = data[1].poin;
                $scope.detail_musuh['poinBabak1'] = data[0].poin;
            }
            $scope.waktu2Next = time2Babak2;

            if (angular.isDefined(stopTimerKeBabak2)) return;
            stopTimerKeBabak2 = $interval(function () {
                if ($scope.waktu2Next > 0) {
                    $scope.waktu2Next--;
                    playTimer(document.getElementById('timerNext'));
                } else {
                    if (angular.isDefined(stopTimerKeBabak2)) {
                        $interval.cancel(stopTimerKeBabak2);
                        stopTimerKeBabak2 = undefined;
                    }


                    goBabak2();

                }
            }, 1000);
        });

        function goBabak2(){
            socket.emit('ready babak 2', 'ok');
            setShow(1);
        }

        socket.on('ready other babak 2', function () {
            socket.emit('all ready babak 2', 'ok');
        });

        socket.on('pilihan soal', function (data) {
            var ele = document.getElementsByClassName("inputPilihan");
            console.log(ele.length);
            for (var i = 0; i < ele.length; i++) {
                ele[i].checked = false;
                console.log(ele[i].checked);
            }

            $scope.answer = false;

            tipeGilir = data.tipe;
            $scope.resetFightBabak2();
            $scope.fightBabak2();
            $scope.opponentAct = "";
            $scope.pilihan_soal = [];
            if (data.user == $scope.detail_ku['username']) {
                for (var i = 0; i < data.soal.length; i++) {
                    $scope.pilihan_soal[i] = {
                        id: i, _id: data.soal[i]._id, question: data.soal[i].question, answer: data.soal[i].answer
                    };
                }
                $scope.textShift = 'Silahkan pilih pertanyaan untuk lawan Anda';
                $scope.isShift = true;
                setView(1);
                $scope.isType = false;
            }
            else {
                $scope.textShift = 'Menunggu pertanyaan dari ' + data.user;
                $scope.isShift = false;
                setView(4);
                $scope.isType = false;
            }
        });

        $scope.doPilih = function (pilihan) {
            socket.emit('pertanyaan pilihan', pilihan);
            console.log(pilihan);
            $scope.textShift = 'Mengirim pertanyaan';
            setView(-1);
        };

        socket.on('jawaben rek', function (data) {
            console.log(data);
            $scope.resetAnsweringBabak2();
            $scope.answeringBabak2();
            setView(0);
            $scope.isType = false;
            if (data.user == $scope.detail_ku['username']) {

                $scope.isShift = true;
                setButton(1);
                $scope.textShift = 'Giliran Anda, silahkan jawab';
            }
            else {

                $scope.isShift = false;
                //$scope.showSoal = true;
                $scope.answerShift = false;
                $scope.textShift = 'Giliran ' + data.user;
            }
            $scope.soal = data.soal.pertanyaan;
            _idSoal = data.soal.id;
        });

        $scope.jawabBabak2 = function (userAnswer) {
            var data_jawaban = {
                'username': $scope.detail_ku['username'],
                'time': 0,
                '_id': _idSoal,
                'answer': userAnswer,
                'tipe': tipeGilir
            };
            socket.emit('answer babak 2', data_jawaban);
            $scope.userAnswer = false;
        };

        socket.on('other answer babak 2', function (data) {
            console.log(data);
            socket.emit('answer babak 2', data);
        });

        socket.on('result answered babak 2', function (data) {
            $scope.answerShift = false;
            $scope.opponentAct = data.username + ' menjawab ' + data.answer;
            if (data.username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data.poin;
            }
            else {
                $scope.detail_musuh['poin'] = data.poin;
            }

            var x = (data.isbenar == '1')?'. Benar!':'. Salah!';
            $scope.opponentAct = $scope.opponentAct+ x;
            $scope.stopAnsweringBabak2();
        });

        $scope.fightBabak2 = function () {
            if (angular.isDefined(stopTimer2)) return;

            stopTimer2 = $interval(function () {
                if ($scope.waktu1 > 0) {
                    $scope.waktu1--;
                    playTimer(document.getElementById('playTimer'));
                }
                else {
                    $scope.stopFightBabak2();
                    if ($scope.isShift) {
                        var data_jawaban = {
                            'username': $scope.detail_ku['username'],
                            'time': 0,
                            '_id': _idSoal,
                            'answer': 'bonus',
                            'tipe': tipeGilir
                        };

                        socket.emit('answer babak 2', data_jawaban);
                        $scope.userAnswer = false;
                    }
                }
            }, 1000);
        };

        $scope.resetFightBabak2 = function () {
            $scope.waktu1 = secondFight2;
            $scope.stopAnsweringBabak2();
        };

        $scope.stopFightBabak2 = function () {
            if (angular.isDefined(stopTimer2)) {
                $interval.cancel(stopTimer2);
                stopTimer2 = undefined;
            }
        };

        $scope.answeringBabak2 = function () {
            if (angular.isDefined(mandek)) return;
            mandek = $interval(function () {
                if ($scope.waktu1 > 0) {
                    $scope.waktu1--;
                    playTimer(document.getElementById('playTimer'));
                }
                else {
                    $scope.jawabBabak2("");
                }
            }, 1000);
        };

        $scope.resetAnsweringBabak2 = function () {
            $scope.stopFightBabak2();
            $scope.waktu1 = secondAnswer2;
        };

        $scope.stopAnsweringBabak2 = function(){
            if (angular.isDefined(mandek)) {
                $interval.cancel(mandek);
                mandek = undefined;
            }
        };

        socket.on('babak 2 done', function (data) {
            setShow(2);
            $scope.babakX = 'Babak 3';
            $scope.textAboutBabak = 'Pada babak ini akan ada 16 kotak dengan tiap kotak berisi pertanyaan yang berbeda. Anda harus memilih salah satu kotak untuk kemudian menjawab pertanyaan di dalamnya. Poin yang dihitung adalah banyaknya kotak yang terhubung.';
            if(data[0].username == $scope.detail_ku['username']){
                $scope.detail_ku['poinBabak2'] = data[0].poin;
                $scope.detail_musuh['poinBabak2'] = data[1].poin;
            }
            else{
                $scope.detail_ku['poinBabak2'] = data[1].poin;
                $scope.detail_musuh['poinBabak2'] = data[0].poin;
            }
            $scope.waktu2Next = time2Babak3;

            if (angular.isDefined(stopTimerKeBabak3)) return;
            stopTimerKeBabak2 = $interval(function () {
                if ($scope.waktu2Next > 0) {
                    $scope.waktu2Next--;
                    playTimer(document.getElementById('timerNext'));
                } else {
                    if (angular.isDefined(stopTimerKeBabak3)) {
                        $interval.cancel(stopTimerKeBabak3);
                        stopTimerKeBabak3 = undefined;
                    }
                    //goBabak2();
                }
            }, 1000);
        });

        socket.on('logout', function () {
            $state.go('login');
        });

        function goBabak3(){
            socket.emit('ready babak 3', 'ok');
            $scope.isHeader = true;
        }

        socket.on('ready other babak 3', function () {
            socket.emit('all ready babak 3', 'ok');
        });

        socket.on('grid soal', function (data) {
            $scope.isHeader = true;
            console.log(data.soal[0].benar);
            setView(2);
            for (var i = 0; i < data.soal.length; i++) {
                $scope.images.push({
                    id: i,
                    soal: data.soal[i].question,
                    A: data.soal[i].A,
                    B: data.soal[i].B,
                    C: data.soal[i].C,
                    D: data.soal[i].D,
                    terjawab: false
                });
            }
            $scope.resetFightBabak3();
            $scope.fightBabak3();

            if (data.user == $scope.detail_ku['username']) {
                $scope.textShift = 'Giliran Anda, Silahkan pilih pertanyaan';
                $scope.isShift = true;
            }
            else{
                $scope.textShift = 'Giliran '+data.user;
                $scope.isShift = false;
            }
        });

        socket.on('buka musuh', function (ok) {
            setOpen(ok);
            noSoal = ok;
            $scope.isType = false;
            $scope.stopFightBabak3();
            $scope.resetAnsweringBabak3();
            setTimeout( function() {
                $scope.answeringBabak3();
                //$scope.isHeader = false;
                $scope.soal = $scope.images[ok].soal;
                setView(0);
            }, 1000);
        });

        $scope.jawabBabak3 = function (userAnswer) {
            var data_jawaban = {
                'username': $scope.detail_ku['username'],
                'time': $scope.waktu1,
                'answer': userAnswer,
                'tipe': 'X',
                'no': noSoal
            };
            setButton(-1);
            //$scope.steps++;
            socket.emit('answer babak 3', data_jawaban);
            $scope.userAnswer = '';
            $scope.stopAnsweringBabak3();
        };

        socket.on('other answer babak 3', function (data) {
            console.log('menerima jawaban babak 3 dari ' + data.username + ' ===== send to server');
            socket.emit('answer babak 3', data);
            $scope.stopAnsweringBabak3();
            //$scope.stopFight();
        });

        socket.on('result answered babak 3', function (data) {
            $scope.userAnswer = '';

            $scope.opponentAct = data.username + ' menjawab ' + $scope.images[data.no];
            if (data.isbenar == '1') {
                $scope.opponentAct = $scope.opponentAct + '. Benar!';
                $scope.images[data.no].terjawab = true;
            }
            else {
                $scope.opponentAct = $scope.opponentAct + '. Salah!';
            }

            $scope.opponentAct = $scope.opponentAct.replace(localStorage.getItem('username'), 'Anda');

            if (data.username == $scope.username) {
                if(data.isbenar == '1'){
                    var cells = document.getElementsByClassName("sel");
                    move(cells[data.no])
                        .set('background-color', 'blue')
                        .end();
                }
                $scope.detail_ku['poin'] = data.poin;
            }
            else {
                if(data.isbenar == '1'){
                    var cells = document.getElementsByClassName("sel");
                    move(cells[data.no])
                        .set('background-color', 'red')
                        .end();
                }
                $scope.detail_musuh['poin'] = data.poin;
            }
        });

        socket.on('babak 3 lanjut', function () {
            setView(2);
            $scope.isHeader = true;
            $scope.isShift = !$scope.isShift;
            $scope.resetFightBabak3();
            $scope.fightBabak3();
            $scope.textShift = ($scope.isShift ? 'Giliran Anda, Silahkan pilih pertanyaan': 'Giliran '+$scope.detail_musuh['username']);
        });

        socket.on('noFight', function (data) {
            $scope.stopFightBabak3();
            $scope.textGilir = 'Waktu habis! ' + (data.replace(localStorage.getItem('username'), 'Anda')) + ' tidak memilih';
        });

        socket.on('noAnswer', function (data) {
            $scope.textGilir = 'Waktu habis! ' + (data.replace(localStorage.getItem('username'), 'Anda')) + ' tidak menjawab';
        });

        socket.on('babak 3 done', function (data) {
            setView(2);
            setTimeout(function () {
                $scope.stopFightBabak3();
                setShow(2);
                $scope.babakX = 'Kembali ke Home';
                $scope.textAboutBabak = '';
                if(data[0].username == $scope.detail_ku['username']){
                    $scope.detail_ku['poinBabak3'] = data[0].poin;
                    $scope.detail_musuh['poinBabak3'] = data[1].poin;
                }
                else{
                    $scope.detail_ku['poinBabak3'] = data[1].poin;
                    $scope.detail_musuh['poinBabak3'] = data[0].poin;
                }
                $scope.detail_ku['poin'] = $scope.detail_ku['poinBabak1'] + $scope.detail_ku['poinBabak2'] + $scope.detail_ku['poinBabak3'];
                $scope.detail_musuh['poin'] = $scope.detail_musuh['poinBabak1'] + $scope.detail_musuh['poinBabak2'] + $scope.detail_musuh['poinBabak3'];
                $scope.waktu2Next = secondDone;

                if (angular.isDefined(stopTimerKeBabak3)) return;
                stopTimerKeBabak2 = $interval(function () {
                    if ($scope.waktu2Next > 0) {
                        $scope.waktu2Next--;
                        playTimer(document.getElementById('timerNext'));
                    } else {
                        if (angular.isDefined(stopTimerKeBabak3)) {
                            $interval.cancel(stopTimerKeBabak3);
                            stopTimerKeBabak3 = undefined;
                        }
                        //socket.emit('game done', $scope.timer);
                        //socket.emit('wis bar');
                    }
                }, 1000);
            }, 2000);

        });


        $scope.fightBabak3 = function () {
            if (angular.isDefined(stopTimer3)) return;

            stopTimer3 = $interval(function () {
                if ($scope.waktu1 > 0) {
                    $scope.waktu1--;
                    playTimer(document.getElementById('playTimer'));
                }
                else {
                    if ($scope.isShift) {
                        $scope.stopFightBabak3();
                        $scope.jawabBabak3('noFight');
                    }
                }
            }, 1000);
        };

        $scope.resetFightBabak3 = function () {
            $scope.waktu1 = secondFight3;
            $scope.stopAnsweringBabak3();
        };

        $scope.stopFightBabak3 = function () {
            if (angular.isDefined(stopTimer3)) {
                $interval.cancel(stopTimer3);
                stopTimer3 = undefined;
                console.log('fight off');
            }
        };


        $scope.answeringBabak3 = function () {
            if (angular.isDefined(mandek3)) return;
            mandek3 = $interval(function () {
                if ($scope.waktu1 > 0) {
                    $scope.waktu1--;
                    playTimer(document.getElementById('playTimer'));
                    console.log('answering on');
                    $scope.steps = $scope.waktu1;
                }
                else {
                    if ($scope.isShift) {
                        $scope.stopAnsweringBabak3();
                        console.log('jawab? waktu = ' + $scope.waktu_jawab);
                        $scope.jawabBabak3("noAnswer");
                    }
                }
            }, 1000);
        };

        $scope.resetAnsweringBabak3 = function () {
            $scope.waktu1 = secondAnswer3;
        };

        $scope.stopAnsweringBabak3 = function(){
            if (angular.isDefined(mandek3)) {
                $interval.cancel(mandek3);
                mandek3 = undefined;
                console.log('answering off');
            }
        };

        $scope.openQuestion = function (ok) {
            $scope.isType = false;

            if($scope.isShift && !$scope.images[ok].terjawab){
                setOpen(ok);
                noSoal = ok;
                socket.emit('open babak 3', ok);
                $scope.stopFightBabak3();
                $scope.resetAnsweringBabak3();
                setTimeout( function(){
                    $scope.soal = $scope.images[ok].soal;
                    $scope.jawabanA = $scope.images[ok].A;
                    $scope.jawabanB = $scope.images[ok].B;
                    $scope.jawabanC = $scope.images[ok].C;
                    $scope.jawabanD = $scope.images[ok].D;
                    setView(0);
                    setButton(3);
                    $scope.answeringBabak3();
                }, 1000);
            }
        };

        function setOpen(no){
            var cells = document.getElementsByClassName("sel");

            move(cells[no])
                .set('background-color', 'yellow')
                .duration(1000)
                .scale(1.2)
                .end(function () {
                        move(cells[no])
                            .set('background-color', 'white')
                            .scale(1)
                            .end();
                    });
        }
    }])
    .controller('NavCtrl', ['$scope', '$ionicSideMenuDelegate', '$state', 'socket','$ionicHistory', function ($scope, $ionicSideMenuDelegate, $state, socket, $ionicHistory) {
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
    .controller('LoginCtrl', ['$scope', 'LoginService', '$ionicPopup', '$state', 'socket', '$ionicHistory', function ($scope, LoginService, $ionicPopup, $state, socket, $ionicHistory) {
        console.log('ini halaman login');
        if (localStorage.getItem("username") != "") {
            LoginService.loginUser(localStorage.getItem("username"), localStorage.getItem("password")).success(function () {
                socket.emit('successlogin', {username: localStorage.getItem("username")});
                console.log(localStorage.username + ' berhasil login');
                $state.go('tab.dash');
            }).error(function () {
                $ionicPopup.alert({
                    title: 'Login Gagal!',
                    template: 'Terjadi gangguan pada server!'
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
                socket.emit('successlogin', {username: $scope.data.username});
                socket.on('auth', function (auth) {
                    if (auth == 1) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('tab.dash');
                    }
                    else {
                        $scope.template = 'User sudah login';
                        $ionicPopup.alert({
                            title: 'Login gagal!',
                            template: $scope.template
                        });
                    }
                })

            }).error(function (data) {
                console.log(data);
                if (data == '0') {
                    $scope.template = 'Terjadi kesalahan koneksi, atau terjadi gangguan pada server!/nSilahkan hubungi untuk keterangan lebih lanjut';
                }
                else if (data == '1') {
                    $scope.template = 'Username atau password salah';
                }
                $ionicPopup.alert({
                    title: 'Login gagal!',
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