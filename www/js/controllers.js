angular.module('starter.controllers', [])
    .controller('DashCtrl', ['$scope', '$state', 'socket', '$ionicLoading', '$ionicHistory', '$rootScope', '$ionicModal', '$interval', 'URL', function ($scope, $state, socket, $ionicLoading, $ionicHistory, $rootScope, $ionicModal, $interval, URL) {
        var url = URL.get();
        var stopPrePlay;
        var tipeUser = '';
        var stopTimer1;
        var stopTimerKeBabak2;
        var stopTimerKeBabak3;
        var stopKeHome;
        var _idSoalBabak1 = '';
        var _idSoalBabak2 = '';
        var tipeGilir = '';
        var stopTimer2;
        var mandek;
        var stopTimer3;
        $scope.terpilih = [];
        $scope.images = [];
        var noSoal = 0;
        var mandek3;


        var secondPrePlay = 10;
        var time2Babak2 = 10;
        var time2Babak3 = 10;
        var secondBabak1 = 10;
        var secondFight2 = 10;
        var secondAnswer2 = 10;
        var secondFight3 = 10;
        var secondAnswer3 = 10;
        var secondDone = 10;

        var state = 0;


        $scope.show = [10];
        $scope.button = [3];
        $scope.view = [3];
        $scope.steps = 0;
        $scope.username = localStorage.getItem("username");
        console.log('ini halaman dash');

        $scope.foto_profil = url + '/images/user/' + $scope.username + '.jpg';
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
            console.log('panjang : ' + inp.length);
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
            localStorage.setItem("username", "");
            localStorage.setItem("password", "");
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

        function setShow(id) {
            for (var i = 0; i < 10; i++) {
                if (i == id) {
                    $scope.show[i] = true;
                }
                else {
                    $scope.show[i] = false;
                }
            }
        }

        function setButton(id) {
            for (var i = 0; i < 4; i++) {
                if (i == id) {
                    $scope.button[i] = true;
                }
                else {
                    $scope.button[i] = false;
                }
            }
        }

        function setView(id) {
            for (var i = 0; i < 5; i++) {
                if (i == id) {
                    $scope.view[i] = true;
                }
                else {
                    $scope.view[i] = false;
                }
            }
        }

        function playTimer(detikan) {
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

        function playPoint(poin) {

            move(poin)
                .ease('snap')
                .set('opacity', 1)
                .scale(2)
                .duration('0s')
                .end();
            move(poin)
                .ease('out')
                //.rotate(140)
                .scale(1)
                .set('opacity', 1)
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
                'poinBabak3': 0,
                'date': Date()
            };

            $rootScope.detail_musuh = $scope.detail_musuh;

            $scope.detail_ku = {
                'username': localStorage.getItem("username"),
                'poin': data.poin,
                'poinBabak1': 0,
                'poinBabak2': 0,
                'poinBabak3': 0,
                'date': Date()
            };
            //console.log('musuhku adalah '+$scope.detail_musuh['username']);
            console.log(data.username);
            $scope.foto_profil_musuh = url + '/images/user/' + data.username + '.jpg';
            console.log($scope.detail_ku);
        });

        socket.on('ready wait all', function (data) {
            $scope.username = localStorage.getItem("username");
            localStorage.setItem('poin babak 1', JSON.stringify({}));
            localStorage.setItem('poin babak 2', JSON.stringify({}));
            setShow(0);
            $scope.openModalPlay();
            $scope.goPrePlay();
            $scope.timerPrePlay = secondPrePlay;
        });

        $scope.goPrePlay = function () {
            if (angular.isDefined(stopPrePlay)) return;

            stopPrePlay = $interval(function () {
                if ($scope.timerPrePlay > 0) {
                     playTimer(document.getElementById('myTimer'));
                    $scope.timerPrePlay--;
                }
                else {
                    $scope.startPlay();
                    setShow(1); //view tampilan soal full header
                    goBabak1();
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

        function goBabak1() {
            setShow(1);
            socket.emit('ready babak 1', 'ok');
            $scope.isShift = false;
            $scope.opponentAct = '';
            $scope.userAnswer = '';
            setView(0); //view tampilan soal
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
                            'answer': "noAnswer",
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


        socket.on('soal babak 1', function (data) {
            state = 1;
            _idSoalBabak1 = data.soal._id;
            $scope.resetFightTimer1();
            $scope.opponentAct = "";
            $scope.isType = false;
            $scope.ndelik = true;
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
            $scope.soal = data.soal.question;
            $scope.jawaban = data.soal.choice;
            $scope.ndelik = true;

        });

        $scope.jawabBabak1 = function (userAnswer) {
            setAnswer(userAnswer);
            socket.emit('jawaban babak 1', userAnswer);
            $scope.stopFightTimer1();
            setTimeout(function () {
                var data_jawaban = {
                    '_id': _idSoalBabak1,
                    'username': $scope.detail_ku['username'],
                    'time': $scope.waktu1,
                    'answer': userAnswer,
                    'tipe': tipeUser
                };
                $scope.isShift = false;
                socket.emit('answer babak 1', data_jawaban);
            }, 2000);

        };

        socket.on('jawaban babak 1', function (data) {
            setAnswer(data);
            $scope.stopFightTimer1();
        });

        socket.on('other answer babak 1', function (data) {
            console.log('menerima jawaban dari ' + data.username + ' ===== send to server');
            socket.emit('answer babak 1', data);
            $scope.stopFightTimer1();
        });

        socket.on('result answered babak 1', function (data) {
            $scope.ndelik = false;
            $scope.isType = true;
            $scope.opponentAct = data.username + ' menjawab ' + $scope.jawaban[data.answer];
            if (data.username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data.poin;
                $scope.isTrueIcon = "img/true.png";
                playPoint(document.getElementById('myPoin'));
            }
            else {
                $scope.detail_musuh['poin'] = data.poin;
                $scope.isTrueIcon = "img/false.png";
                playPoint(document.getElementById('urPoin'));
            }

            var x = (data.isbenar == '1') ? '. Benar!' : '. Salah!';
            $scope.isTrueIcon = (data.isbenar == '1') ? "img/true.png" : "img/false.png";
            $scope.opponentAct = $scope.opponentAct + x;
        });

        socket.on('timeout', function (data) {
            $scope.ndelik = false;
            $scope.isType = true;
            $scope.opponentAct = 'waktu habis! ' + data + ' tidak menjawab';
        });

        socket.on('babak 1 done', function (data) {
            $scope.detail_ku['poinBabak1'] = $scope.detail_ku['poin'];
            $scope.detail_musuh['poinBabak1'] = $scope.detail_musuh['poin'];
            $scope.babakX = 'Babak 2';
            $scope.textAboutBabak = 'Pada babak 2 Anda harus memilihkan pertanyaan untuk dijawab oleh lawan Anda. Selamat bermain.';
            if (data[0].username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data[0].poin;
                $scope.detail_musuh['poin'] = data[1].poin;
            }
            else {
                $scope.detail_ku['poin'] = data[1].poin;
                $scope.detail_musuh['poin'] = data[0].poin;
            }
            $scope.poinBabak1 = true;
            $scope.poinBabak2 = false;
            $scope.poinBabak3 = false;
            $scope.isAkhir = 'SEMENTARA';
            setShow(2);
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

        function goBabak2() {
            socket.emit('ready babak 2', 'ok');
            setShow(1);
        }

        socket.on('ready other babak 2', function () {
            socket.emit('all ready babak 2', 'ok');
        });

        socket.on('pilihan soal', function (data) {
            state = 2;
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
                //$scope.pilihan_soal = data.soal;
                for (var i = 0; i < data.soal.length; i++) {
                    $scope.pilihan_soal[i] = {
                        //no: i, _id: data.soal[i]._id, soal: data.soal[i].question, jawaban: data.soal[i].choice
                        no: i, question: data.soal[i].question
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
                $scope.textShift = 'Giliran Anda, silahkan jawab';
            }
            else {

                $scope.isShift = false;
                //$scope.showSoal = true;
                $scope.answerShift = false;
                $scope.textShift = 'Giliran ' + data.user;
            }
            $scope.soal = data.soal.question;
            $scope.jawaban = data.soal.choice;
            $scope.ndelik = true;
            _idSoalBabak2 = data.soal._id;
        });

        $scope.jawabBabak2 = function (userAnswer) {
            setAnswer(userAnswer);
            socket.emit('jawaban babak 2', userAnswer);
            $scope.stopFightBabak2();
            setTimeout(function () {
                var data_jawaban = {
                    'username': $scope.detail_ku['username'],
                    'time': 0,
                    '_id': _idSoalBabak2,
                    'answer': userAnswer,
                    'tipe': tipeGilir
                };
                console.log(data_jawaban);
                socket.emit('answer babak 2', data_jawaban);
                $scope.userAnswer = false;
            }, 2000);
        };

        socket.on('jawaban babak 2', function (data) {
            setAnswer(data);
            $scope.stopFightBabak2();
            $scope.stopAnsweringBabak2();
        });

        socket.on('other answer babak 2', function (data) {
            console.log(data);
            socket.emit('answer babak 2', data);
        });

        socket.on('result answered babak 2', function (data) {
            $scope.answerShift = false;
            $scope.ndelik = false;
            $scope.isType = true;
            $scope.opponentAct = data.username + ' menjawab ' + $scope.jawaban[data.answer];
            if (data.username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data.poin;
                playPoint(document.getElementById('myPoin'));
            }
            else {
                $scope.detail_musuh['poin'] = data.poin;
                playPoint(document.getElementById('urPoin'));
            }

            var x = (data.isbenar == '1') ? '. Benar!' : '. Salah!';
            $scope.opponentAct = $scope.opponentAct + x;
            $scope.isTrueIcon = (data.isbenar == '1') ? "img/true.png" : "img/false.png";
            $scope.stopAnsweringBabak2();
        });

        socket.on('noChoose', function (data) {
            $scope.ndelik = false;
            $scope.isType = true;
            setView(3);
            $scope.textShift ='Waktu habis! ' + (data.u.replace($scope.detail_ku['username'], 'Anda')) + ' tidak menjawab';
            if (data.username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data.poin;
                playPoint(document.getElementById('myPoin'));
            }
            else {
                $scope.detail_musuh['poin'] = data.poin;
                playPoint(document.getElementById('urPoin'));
            }
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
                    $scope.jawabBabak2('noChoose');
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
                    $scope.jawabBabak2("noAnswer");
                }
            }, 1000);
        };

        $scope.resetAnsweringBabak2 = function () {
            $scope.stopFightBabak2();
            $scope.waktu1 = secondAnswer2;
        };

        $scope.stopAnsweringBabak2 = function () {
            if (angular.isDefined(mandek)) {
                $interval.cancel(mandek);
                mandek = undefined;
            }
        };

        socket.on('babak 2 done', function (data) {
            setShow(2);
            $scope.babakX = 'Babak 3';
            $scope.detail_ku['poinBabak2'] = $scope.detail_ku['poin'] - $scope.detail_ku['poinBabak1'];
            $scope.detail_musuh['poinBabak2'] = $scope.detail_musuh['poin'] - $scope.detail_musuh['poinBabak1'];
            $scope.textAboutBabak = 'Pada babak ini akan ada 16 kotak dengan tiap kotak berisi pertanyaan yang berbeda. Anda harus memilih salah satu kotak untuk kemudian menjawab pertanyaan di dalamnya. Poin yang dihitung adalah banyaknya kotak yang terhubung.';
            if (data[0].username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data[0].poin;
                $scope.detail_musuh['poin'] = data[1].poin;
            }
            else {
                $scope.detail_ku['poin'] = data[1].poin;
                $scope.detail_musuh['poin'] = data[0].poin;
            }
            $scope.poinBabak1 = true;
            $scope.poinBabak2 = true;
            $scope.poinBabak3 = false;
            $scope.isAkhir = 'SEMENTARA';
            $scope.waktu2Next = time2Babak3;

            if (angular.isDefined(stopTimerKeBabak3)) return;
            stopTimerKeBabak3 = $interval(function () {
                if ($scope.waktu2Next > 0) {
                    $scope.waktu2Next--;
                    playTimer(document.getElementById('timerNext'));
                } else {
                    if (angular.isDefined(stopTimerKeBabak3)) {
                        $interval.cancel(stopTimerKeBabak3);
                        stopTimerKeBabak3 = undefined;
                        console.log('set undefined');
                    }
                    console.log('go babak 2');
                    goBabak3();
                }
            }, 1000);
        });

        socket.on('logout', function () {
            $state.go('login');
        });

        function goBabak3() {
            socket.emit('ready babak 3', 'ok');
            $scope.isHeader = true;
            setShow(1);
        }

        socket.on('ready other babak 3', function () {
            socket.emit('all ready babak 3', 'ok');
        });

        socket.on('grid soal', function (data) {
            $scope.images = [];
            state = 3;
            setView(2);
            $scope.isSelesai = false;
            for (var i = 0; i < data.soal.length; i++) {
                $scope.images.push({
                    id: i,
                    _id: data.soal[i]._id,
                    soal: data.soal[i].question,
                    pilihan: data.soal[i].choice,
                    terjawab: false
                });
            }
            $scope.resetFightBabak3();
            $scope.fightBabak3();

            if (data.user == $scope.detail_ku['username']) {
                $scope.textShift = 'Giliran Anda, Silahkan pilih pertanyaan';
                $scope.isShift = true;
            }
            else {
                $scope.textShift = 'Giliran ' + data.user;
                $scope.isShift = false;
            }
        });


        $scope.jawabBabak3 = function (userAnswer) {
            if ($scope.isShift) {
                setAnswer(userAnswer);
                socket.emit('jawaban babak 3', userAnswer);
                setTimeout(function () {
                    $scope.ndelik = false;
                    var data_jawaban = {
                        'username': $scope.detail_ku['username'],
                        'time': $scope.waktu1,
                        'answer': userAnswer,
                        'tipe': 'X',
                        '_id': $scope.images[noSoal]._id,
                        'no': noSoal
                    };
                    //$scope.steps++;
                    socket.emit('answer babak 3', data_jawaban);
                    $scope.userAnswer = '';
                    $scope.stopAnsweringBabak3();
                }, 1000);
            }
        };

        socket.on('jawaban babak 3', function (data) {
            setAnswer(data);
        });

        socket.on('other answer babak 3', function (data) {
            socket.emit('answer babak 3', data);
            $scope.stopAnsweringBabak3();
        });

        socket.on('result answered babak 3', function (data) {
            $scope.stopFightBabak3();
            $scope.stopAnsweringBabak3();
            $scope.ndelik = false;
            $scope.isType = true;
            $scope.opponentAct = data.username + ' menjawab ' + $scope.jawaban[data.answer];
            if (data.isbenar == '1') {
                $scope.opponentAct = $scope.opponentAct + '. Benar!';
                $scope.images[data.no].terjawab = true;
                $scope.isTrueIcon = "img/true.png";
                //moveIconIsTrue();
                //playPoint(document.getElementById('myPoin'));
            }
            else {
                $scope.opponentAct = $scope.opponentAct + '. Salah!';
                $scope.isTrueIcon = "img/false.png";
                //moveIconIsTrue();
            }

            $scope.opponentAct = $scope.opponentAct.replace(localStorage.getItem('username'), 'Anda');

            if (data.username == $scope.username) {
                if (data.isbenar == '1') {
                    var cells = document.getElementsByClassName("sel");
                    move(cells[data.no])
                        .set('background-color', 'blue')
                        .end();
                    playPoint(document.getElementById('myPoin'));
                }

                $scope.detail_ku['poin'] = data.poin;
            }
            else {
                if (data.isbenar == '1') {
                    var cells = document.getElementsByClassName("sel");
                    move(cells[data.no])
                        .set('background-color', 'red')
                        .end();
                    playPoint(document.getElementById('urPoin'));
                }
                $scope.detail_musuh['poin'] = data.poin;
            }
        });

        socket.on('babak 3 lanjut', function () {
            setView(2);
            $scope.isSelesai = false;
            $scope.isHeader = true;
            $scope.isShift = !$scope.isShift;
            $scope.resetFightBabak3();
            $scope.fightBabak3();
            $scope.textShift = ($scope.isShift ? 'Giliran Anda, Silahkan pilih pertanyaan' : 'Giliran ' + $scope.detail_musuh['username']);
        });

        socket.on('noFight', function (data) {
            setView(3);
            $scope.stopFightBabak3();
            $scope.textShift = 'Waktu habis! ' + (data.replace($scope.detail_ku['username'], 'Anda')) + ' tidak memilih';
        });

        socket.on('noAnswer', function (data) {

            $scope.ndelik = false;
            $scope.isType = true;
            $scope.opponentAct ='Waktu habis! ' + (data.replace($scope.detail_ku['username'], 'Anda')) + ' tidak menjawab';
            //$scope.textShift = 'Waktu habis! ' + (data.replace($scope.detail_ku['username'], 'Anda')) + ' tidak menjawab';
        });



        socket.on('babak 3 done', function (data) {
            $scope.textShift = "SELESAI";
            $scope.isSelesai = true;
            console.log(data);
            setView(2);
            $scope.poinBabak1 = true;
            $scope.poinBabak2 = true;
            $scope.poinBabak3 = true;
            $scope.isAkhir = 'AKHIR';
            if($scope.detail_ku['poin'] > $scope.detail_musuh['poin']){
                $scope.ikonAkhir = 'img/true.png';
                $scope.isMenang = 'Selamat Anda menang';
            }
            else{
                $scope.ikonAkhir = 'img/false.png';
                $scope.isMenang = 'Anda kalah'
            }
            setTimeout(function () {
                $scope.stopFightBabak3();
                setShow(2);
                $scope.babakX = 'Kembali ke Home';
                $scope.textAboutBabak = '';
                if (data[0].username == $scope.detail_ku['username']) {
                    $scope.detail_ku['poinBabak3'] = data[0].poin;
                    $scope.detail_musuh['poinBabak3'] = data[1].poin;
                }
                else {
                    $scope.detail_ku['poinBabak3'] = data[1].poin;
                    $scope.detail_musuh['poinBabak3'] = data[0].poin;
                }
                $scope.detail_ku['poin'] = $scope.detail_ku['poinBabak1'] + $scope.detail_ku['poinBabak2'] + $scope.detail_ku['poinBabak3'];
                $scope.detail_musuh['poin'] = $scope.detail_musuh['poinBabak1'] + $scope.detail_musuh['poinBabak2'] + $scope.detail_musuh['poinBabak3'];
                var tempDate = new Date();
                var dtGame = {
                    'tanggal': ''+tempDate.getDate()+'/'+(tempDate.getMonth()+1)+'/'+tempDate.getFullYear()+'  '+tempDate.getHours()+':'+tempDate.getMinutes(),
                    'poinku': parseInt($scope.detail_ku['poin'], 10),
                    'uMusuh': $scope.detail_musuh['username'],
                    'poinMusuh': parseInt($scope.detail_musuh['poin'], 10)
                };
                var obj = JSON.parse(localStorage.getItem('data-game'));
                if(obj == null){
                    obj = [];
                }
                console.log(obj);
                obj.push(dtGame);
                localStorage.setItem('data-game', JSON.stringify(obj));
                $scope.waktu2Next = secondDone;
                if (angular.isDefined(stopKeHome)) return;
                stopKeHome = $interval(function () {
                    if ($scope.waktu2Next > 0) {
                        playTimer(document.getElementById('timerNext'));
                        $scope.waktu2Next--;
                    } else {
                        if (angular.isDefined(stopKeHome)) {
                            $interval.cancel(stopKeHome);
                            stopKeHome = undefined;
                            $scope.$emit('todo:listChanged');
                            socket.emit('game done', $scope.timer);
                            socket.emit('wis bar');
                        }
                    }
                }, 1000);
            }, 2000);

        });


        $scope.fightBabak3 = function () {
            if (angular.isDefined(stopTimer3)) return;

            stopTimer3 = $interval(function () {
                if ($scope.waktu1 > 0) {
                    playTimer(document.getElementById('playTimer'));
                    $scope.waktu1--;
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
                    playTimer(document.getElementById('playTimer'));
                    $scope.waktu1--;
                    console.log('answering on');
                    $scope.steps = $scope.waktu1;
                }
                else {
                    if ($scope.isShift) {
                        $scope.stopAnsweringBabak3();
                        $scope.jawabBabak3("noAnswer");
                    }
                }
            }, 1000);
        };

        $scope.resetAnsweringBabak3 = function () {
            $scope.waktu1 = secondAnswer3;
        };

        $scope.stopAnsweringBabak3 = function () {
            if (angular.isDefined(mandek3)) {
                $interval.cancel(mandek3);
                mandek3 = undefined;
                console.log('answering off');
            }
        };

        $scope.openQuestion = function (ok) {
            $scope.isType = false;

            if ($scope.isShift && !$scope.images[ok].terjawab) {
                setOpen(ok);
                noSoal = ok;
                socket.emit('open babak 3', ok);
                $scope.stopFightBabak3();
                setTimeout(function () {
                    $scope.resetAnsweringBabak3();
                    $scope.ndelik = true;
                    $scope.soal = $scope.images[ok].soal;
                    $scope.jawaban = $scope.images[ok].pilihan;
                    setView(0);
                    setButton(3);
                    $scope.answeringBabak3();
                }, 1000);
            }
        };

        socket.on('buka musuh', function (ok) {
            setOpen(ok);
            noSoal = ok;
            $scope.isType = false;
            $scope.stopFightBabak3();
            setTimeout(function () {
                $scope.resetAnsweringBabak3();
                $scope.answeringBabak3();
                $scope.ndelik = true;
                $scope.jawaban = $scope.images[ok].pilihan;
                //$scope.isHeader = false;
                $scope.soal = $scope.images[ok].soal;
                setView(0);
            }, 1000);
        });

        function setOpen(no) {
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

        function setAnswer(no) {
            var cells = document.getElementsByClassName("jawaban");
            if (no <= 3) {
                move(cells[no])
                    .set('background-color', 'yellow')
                    .duration(1000)
                    .scale(1.2)
                    .end(function () {
                        move(cells[no])
                            .set('background-color', '#6998ff')
                            .scale(1)
                            .end();
                    });
            }
        }

        function moveIconIsTrue() {
            console.log('move move');
            //var cells = document.getElementsByClassName("gambar_benar");
            //var moveSmall = move('.gambar_benar')
            //    .duration(500)
            //    .scale(2.5)
            //    .then()
            //        .duration(500)
            //        .scale(0)

            move('.kotak_benar')
                .duration(5500)
                .scale(0.5)
                .end();

        }

        $scope.kirimJawaban = function (dt) {
            if ($scope.isShift) {
                if (state == 1) {
                    $scope.jawabBabak1(dt);
                }
                else if (state == 2) {
                    $scope.jawabBabak2(dt);
                }
                else if (state == 3) {
                    $scope.jawabBabak3(dt);
                }
            }
        }
    }])
    .controller('HistoryCtrl', ['$scope', '$ionicSideMenuDelegate', '$state', 'socket', '$ionicHistory','History','$http','$rootScope', function ($scope, $ionicSideMenuDelegate, $state, socket, $ionicHistory, History,$http, $rootScope) {
        $rootScope.$on('todo:listChanged', function() {
            $scope.updateList();
        });

        $scope.updateList = function () {
            $http.get(url + '/api/match/u/'+localStorage.getItem('username')).success(function (response) {
                $scope.riwayat = response;console.log($scope.riwayat);

            }).error(function (err) {
                console.log(err);
            });
        }

        $http.get(url + '/api/match/u/'+localStorage.getItem('username')).success(function (response) {
            $scope.riwayat = response;console.log($scope.riwayat);

        }).error(function (err) {
            console.log(err);
        });
    }])
    .controller('NavCtrl', ['$scope', '$ionicSideMenuDelegate', '$state', 'socket', '$ionicHistory', function ($scope, $ionicSideMenuDelegate, $state, socket, $ionicHistory) {
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
            LoginService.loginUser($scope.data.username.toLowerCase(), $scope.data.password).success(function () {
                localStorage.setItem("username", $scope.data.username.toLowerCase());
                localStorage.setItem("password", $scope.data.password);
                socket.emit('successlogin', {username: $scope.data.username.toLowerCase()});
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
