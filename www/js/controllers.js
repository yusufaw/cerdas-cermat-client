angular.module('starter.controllers', [])
    .controller('DashCtrl', ['$scope', '$state', 'socket', '$ionicLoading', '$ionicHistory', '$rootScope', '$ionicModal', '$interval', 'URL', function ($scope, $state, socket, $ionicLoading, $ionicHistory, $rootScope, $ionicModal, $interval, URL) {
        var uerel = URL.get(); // mendapatkan alamat game server
        var urlImg = 'http://crevion.net/cerdascermat/img/users/'
        var stopPrePlay; // variabel untuk timer pre play
        var tipeUser = ''; //tipe user (X or Y) babak 1 untuk gantian diserver
        var tipeUser2 = '';//tipe user (X or Y) babak 2 untuk gantian diserver
        var stopTimer1; // variabel untuk timer babak 1
        var stopTimer2; // variabel untuk timer babak 2 (pemilihan soal untuk lawan)
        var stopTimer3; // variabel untuk timer babak 3 (pemilihan kotak soal)
        var stopTimerKeBabak2; // variabel untuk timer menuju babak 2
        var stopTimerKeBabak3; // variabel untuk timer menuju babak 3
        var stopKeHome; // variabel untuk timer menuju home
        var _idSoalBabak1 = ''; // id soal babak 1 yang dikirim ketika menjawab
        var _idSoalBabak2 = ''; // id soal babak 2 yang dikirim ketika menjawab
        var mandek2; // variabel untuk timer menjawab soal babak 2
        var mandek3; // variabel untuk timer menjawab soal babak 3
        var noSoal = 0; //no soal untuk jawab kotak babak 3 yang terpilih
        var secondPrePlay = 10;
        var time2Babak2 = 10;
        var time2Babak3 = 10;
        var secondBabak1 = 10;
        var secondFight2 = 10;
        var secondAnswer2 = 10;
        var secondFight3 = 10;
        var secondAnswer3 = 10;
        var secondDone = 10;
        var imgTrue = "img/true-icon.png";
        var imgFalse = "img/false-icon.png";
        var imgWin = "img/win-icon.png";
        var imgLose = "img/lose-icon.png";
        var state = 0; // status babak ke berapa
        $scope.langkah = 0;
        $scope.show = [10];
        $scope.button = [3];
        $scope.view = [3];
        $scope.steps = 0;
        $scope.username = localStorage.getItem("username");
        console.log('Hello, this is dash page!');
        $scope.foto_profil = urlImg + $scope.username + '.jpg';
        $scope.mypoin = 0;
        $scope.isEditIp = false;

        socket.emit('ready tab', 'ok');
        socket.on('my data', function (myData) {
            $scope.mypoin = myData.mypoin;
            console.log($scope.mypoin);
        });



        $scope.challenge = function () {

            if (localStorage.getItem("username") == "") {
                socket.emit('logout', 'oyi');
            }
            else {
                socket.emit('search', 'ok');
                $scope.showLoading();
            }
        };

        $scope.play = function () {
            socket.emit('ready wait', 'ok');
        };

        socket.on('logout', function () {
            $scope.logout();
        });

        $scope.logout = function () {
            localStorage.setItem("username", "");
            localStorage.setItem("password", "");
            $scope.hideLoading();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
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

        socket.on('halo', function () {
            $scope.hideLoading();
            $scope.play();
        });

        function setShow(id) {
            for (var i = 0; i < 10; i++) {
                $scope.show[i] = i == id;
            }
        }

        function setView(id) {
            for (var i = 0; i < 5; i++) {
                $scope.view[i] = i == id;
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
                'poinBabak3': 0
            };

            $scope.detail_ku = {
                'username': localStorage.getItem("username"),
                'poin': data.poin,
                'poinBabak1': 0,
                'poinBabak2': 0,
                'poinBabak3': 0
            };
            $scope.foto_profil_musuh = urlImg + data.username + '.jpg';
        });

        socket.on('ready wait all', function () {
            setShow(0); //view tampilan pre play
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
                    setShow(1); //view tampilan soal dan jawaban full header
                    goBabak1();
                }
            }, 1000);
        };

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
            setShow(1); // show tampilan soal dan jawaban full header
            socket.emit('ready babak 1', 'ok');
            $scope.isShift = false;
            $scope.opponentAct = '';
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
            ++$scope.langkah;
            _idSoalBabak1 = data.soal._id;
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
            $scope.soal = data.soal.question;
            $scope.jawaban = data.soal.choice;
            $scope.ndelik = true; //view kotak 4 pilihan jawaban

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
                $scope.ndelik = false;
                socket.emit('answer babak 1', data_jawaban);
            }, 1000);
        };

        socket.on('jawaban babak 1', function (data) {
            setAnswer(data);
            $scope.stopFightTimer1();
        });

        socket.on('other answer babak 1', function (data) {
            socket.emit('answer babak 1', data);
            $scope.stopFightTimer1();
        });

        socket.on('result answered babak 1', function (data) {
            $scope.ndelik = false; //kotak jawaban disembunyikan
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
            $scope.isTrueIcon = (data.isbenar == '1') ? imgTrue : imgFalse;
            $scope.opponentAct = $scope.opponentAct + x;
            $scope.isType = true; //view informasi benar or salah (icon)
        });

        socket.on('timeout', function (data) {
            $scope.ndelik = false;
            $scope.isType = true;
            $scope.opponentAct = 'Waktu habis! ' + data + ' tidak menjawab';
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
            setShow(2); // view tampilan pre babak 2
            $scope.waktu2Next = time2Babak2;
            $scope.langkah = 0;

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
            setShow(1); // view tampilan full header
        }

        socket.on('ready other babak 2', function () {
            socket.emit('all ready babak 2', 'ok');
        });

        socket.on('pilihan soal', function (data) {
            state = 2;
            ++$scope.langkah;
            var ele = document.getElementsByClassName("inputPilihan");
            console.log('panjang input pilihan : '+ ele.length);
            for (var o = 0; o < ele.length; o++) {
                ele[o].checked = false;
                console.log(ele[o].checked);
            }

            tipeUser2 = data.tipe;
            $scope.resetFightBabak2();
            $scope.fightBabak2();
            $scope.opponentAct = "";
            $scope.pilihan_soal = [];
            if (data.user == $scope.detail_ku['username']) {
                for (var i = 0; i < data.soal.length; i++) {
                    $scope.pilihan_soal[i] = {
                        no: i, question: data.soal[i].question
                    };
                }
                $scope.textShift = 'Silahkan pilih pertanyaan untuk lawan Anda';
                $scope.isShift = true;
                setView(1); //view tampilan list pertanyaan
                $scope.isType = false;
            }
            else {
                $scope.textShift = 'Menunggu pertanyaan dari ' + data.user;
                $scope.isShift = false;
                setView(4); // view tampilan kosong (> 3)
                $scope.isType = false;
            }
        });

        $scope.doPilih = function (pilihan) {
            setView(-1); //view tampilan kosong
            socket.emit('pertanyaan pilihan', pilihan);
            $scope.textShift = 'Mengirim pertanyaan';
        };

        socket.on('jawaben rek', function (data) {
            $scope.resetAnsweringBabak2();
            $scope.answeringBabak2();
            setView(0); // view tampilan soal dan pilihan jawaban
            $scope.isType = false;
            setShift(data.user, 'jawab');
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
                    'tipe': tipeUser2
                };
                socket.emit('answer babak 2', data_jawaban);
            }, 1000);
        };

        socket.on('jawaban babak 2', function (data) {
            setAnswer(data);
            $scope.stopFightBabak2();
            $scope.stopAnsweringBabak2();
        });

        socket.on('other answer babak 2', function (data) {
            socket.emit('answer babak 2', data);
        });

        socket.on('result answered babak 2', function (data) {
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
            $scope.isTrueIcon = (data.isbenar == '1') ?imgTrue : imgFalse;
            $scope.stopAnsweringBabak2();
        });

        socket.on('noChoose', function (data) {
            $scope.ndelik = false;
            $scope.isType = true;
            setView(3); //view tampilan kosong
            $scope.textShift = 'Waktu habis! ' + (data.u.replace($scope.detail_ku['username'], 'Anda')) + ' tidak menjawab';
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
            if (angular.isDefined(mandek2)) return;
            mandek2 = $interval(function () {
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
            if (angular.isDefined(mandek2)) {
                $interval.cancel(mandek2);
                mandek2 = undefined;
            }
        };

        socket.on('babak 2 done', function (data) {
            setShow(2);
            $scope.langkah = 0;
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
                    }
                    goBabak3();
                }
            }, 1000);
        });

        function goBabak3() {
            socket.emit('ready babak 3', 'ok');
            setShow(1); //view tampilan full header
        }

        socket.on('ready other babak 3', function () {
            socket.emit('all ready babak 3', 'ok');
        });

        socket.on('grid soal', function (data) {
            $scope.images = [];
            state = 3;
            setView(2); //view tampilan grid
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
            ++$scope.langkah;
            setShift(data.user, 'pilih pertanyaan');
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
                $scope.isTrueIcon = imgTrue;
            }
            else {
                $scope.opponentAct = $scope.opponentAct + '. Salah!';
                $scope.isTrueIcon = imgFalse;
            }

            $scope.opponentAct = $scope.opponentAct.replace(localStorage.getItem('username'), 'Anda');
            var cells = document.getElementsByClassName("sel");
            if (data.username == $scope.detail_ku['username']) {

                if (data.isbenar == '1') {
                    move(cells[data.no])
                        .set('background-color', '#73b6e5')
                        .end();
                    playPoint(document.getElementById('myPoin'));
                }

                $scope.detail_ku['poin'] = data.poin;
            }
            else {
                if (data.isbenar == '1') {
                    move(cells[data.no])
                        .set('background-color', '#ed7188')
                        .end();
                    playPoint(document.getElementById('urPoin'));
                }
                $scope.detail_musuh['poin'] = data.poin;
            }
        });

        socket.on('babak 3 lanjut', function () {
            setView(2);
            ++$scope.langkah;
            $scope.isSelesai = false;
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
            $scope.opponentAct = 'Waktu habis! ' + (data.replace($scope.detail_ku['username'], 'Anda')) + ' tidak menjawab';
        });

        socket.on('babak 3 done', function (data) {
            if (data[0].username == $scope.detail_ku['username']) {
                $scope.detail_ku['poin'] = data[0].poin;
                $scope.detail_musuh['poin'] = data[1].poin;
            }
            else {
                $scope.detail_ku['poin'] = data[1].poin;
                $scope.detail_musuh['poin'] = data[0].poin;
            }
            $scope.detail_ku['poinBabak3'] = $scope.detail_ku['poin'] - $scope.detail_ku['poinBabak2'] - $scope.detail_ku['poinBabak1'];
            $scope.detail_musuh['poinBabak3'] = $scope.detail_musuh['poin'] - $scope.detail_musuh['poinBabak2'] - $scope.detail_musuh['poinBabak1'];
            $scope.textShift = "SELESAI";
            $scope.isSelesai = true;
            setView(2);
            $scope.poinBabak1 = true;
            $scope.poinBabak2 = true;
            $scope.poinBabak3 = true;
            $scope.langkah = 0;
            $scope.isAkhir = 'AKHIR';
            if ($scope.detail_ku['poin'] > $scope.detail_musuh['poin']) {
                $scope.ikonAkhir = imgWin;
                $scope.isMenang = 'Selamat Anda menang';
            }
            else {
                $scope.ikonAkhir = imgLose;
                $scope.isMenang = 'Anda kalah'
            }
            setTimeout(function () {
                $scope.stopFightBabak3();
                setShow(2);
                $scope.babakX = 'Kembali ke Home';
                $scope.textAboutBabak = '';
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
            }
        };

        $scope.answeringBabak3 = function () {
            if (angular.isDefined(mandek3)) return;
            mandek3 = $interval(function () {
                if ($scope.waktu1 > 0) {
                    playTimer(document.getElementById('playTimer'));
                    $scope.waktu1--;
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
                    setView(0); //view tampilan soal dan pilihan jawaban
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
                $scope.soal = $scope.images[ok].soal;
                setView(0);
            }, 1000);
        });

        function setOpen(no) { //animasi gerakan sel grid yang terpilih
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

        function setAnswer(no) { //animasi gerakan jawaban yang terpilih
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

        function setShift(uX, plusX) {
            if (uX == $scope.detail_ku['username']) {
                $scope.textShift = 'Giliran Anda, Silahkan ' + plusX;
                $scope.isShift = true;
            }
            else {
                $scope.textShift = 'Giliran ' + uX;
                $scope.isShift = false;
            }
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
        };

        socket.on('wis bar', function () {
            $scope.closeModalPlay();
        });
    }])
    .controller('HistoryCtrl', ['$scope', '$ionicSideMenuDelegate', '$state', 'socket', '$ionicHistory', 'History', '$http', '$rootScope', function ($scope, $ionicSideMenuDelegate, $state, socket, $ionicHistory, History, $http, $rootScope) {
        $rootScope.$on('todo:listChanged', function () {
            $scope.updateList();
        });

        $scope.updateList = function () {
            $http.get(url + '/api/match/u/' + localStorage.getItem('username')).success(function (response) {
                $scope.riwayat = response;
            }).error(function (err) {
                console.log(err);
            });
        };

        $http.get(url + '/api/match/u/' + localStorage.getItem('username')).success(function (response) {
            $scope.riwayat = response;

        }).error(function (err) {
            console.log(err);
        });
    }])

    .controller('LoginCtrl', ['$scope', 'LoginService', '$ionicPopup', '$state', 'socket', '$ionicHistory' ,'$rootScope','$ionicLoading', function ($scope, LoginService, $ionicPopup, $state, socket, $ionicHistory, $rootScope, $ionicLoading) {
        $scope.isLogin = true;
        $scope.showLoading = function () {
            $ionicLoading.show({
                template: 'loading...'
            });
        };

        $scope.hideLoading = function () {
            $ionicLoading.hide();
        };

        $scope.alamatGambar = 'img/icon_user.png';
        console.log('ini halaman login');
        if (localStorage.getItem("username") != "") {
            $scope.showLoading();
            LoginService.loginUser(localStorage.getItem("username"), localStorage.getItem("password")).success(function () {
                socket.emit('successlogin', {username: localStorage.getItem("username")});
                console.log(localStorage.username + ' berhasil login');
                socket.on('auth', function (auth) {
                    if (auth == 1) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('tab.dash');
                    }
                    else {
                        $scope.template = 'Akun pemain ini sedang digunakan';
                        $ionicPopup.alert({
                            title: 'Login gagal!',
                            template: $scope.template
                        });
                    }
                });
                $scope.hideLoading();
            }).error(function (data) {
                if (data == '0') {
                    $scope.template = 'Terjadi kesalahan koneksi, atau terjadi gangguan pada server!';
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
                $scope.hideLoading();
            });
        }
        $scope.data = {};

        $scope.login = function () {
            $scope.showLoading();
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
                        $scope.template = 'Akun pemain ini sedang digunakan';
                        $ionicPopup.alert({
                            title: 'Login gagal!',
                            template: $scope.template
                        });
                    }
                });
                $scope.hideLoading();

            }).error(function (data) {
                if (data == '0') {
                    $scope.template = 'Terjadi kesalahan koneksi, atau terjadi gangguan pada server!';
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
                $scope.hideLoading();
            });
        };

        $scope.pilihGambar = function () {
            $scope.alamatGambar ="";
            window.imagePicker.getPictures(
                function(results) {
                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);
                        $scope.alamatGambar = results[i];
                    }
                }, function (error) {
                    console.log('Error: ' + error);
                }
            );
        };

        $scope.daftar = function(){
            $scope.showLoading();
            var fileURL = $scope.alamatGambar;
            var win = function (r) {
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
                $scope.hideLoading();
            };

            var fail = function (error) {
                //alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            };

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "image/jpg";

            var params = {};
            params.username = $scope.data.username.toLowerCase();
            params.value2 = "param";

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(fileURL, encodeURI("http://crevion.net/cerdascermat/unggah.php"), win, fail, options);

            LoginService.daftarUser($scope.data.username.toLowerCase(), $scope.data.password).success(function () {
                $scope.hideLoading();
                localStorage.setItem("username", $scope.data.username.toLowerCase());
                localStorage.setItem("password", $scope.data.password);
                socket.emit('successlogin', {username: $scope.data.username.toLowerCase()});
                socket.on('auth', function (auth) {
                    if (auth == 1) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $ionicPopup.alert({
                            title: 'Selamat!',
                            template: 'Pendaftaran Berhasil'
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
                $scope.hideLoading();
                if (data == '0') {
                    $scope.template = 'Terjadi kesalahan koneksi, atau terjadi gangguan pada server!';
                }
                else if (data == '1') {
                    $scope.template = 'Username atau password salah';
                }
                $ionicPopup.alert({
                    title: 'Pendaftaran gagal!',
                    template: $scope.template
                });
                localStorage.setItem("username", "");
                localStorage.setItem("password", "");
            });
        }
    }])
;
