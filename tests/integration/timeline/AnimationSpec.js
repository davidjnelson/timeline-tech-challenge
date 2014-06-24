'use strict';

define(['text!components/timeline/TimelineData.json', 'testing/TestTools', 'shared/MicrosecondTimer', 'chai', 'jquery'],
    function(Data, TestTools, MicrosecondTimer, chai, $) {
    var expect = chai.expect,
        // divide the ages and milliseconds to run to make the tests run faster
        testSpeedDivisor = 100,
        reduceTestDataByTestSpeedDivisor = function() {
            Data = JSON.parse(Data);

            Data.age = Data.age / testSpeedDivisor;

            for(var i = 0; i < Data.events.length; i++) {
                Data.events[i].age = Data.events[i].age / testSpeedDivisor
            }
        },
        // the tests are doing string comparisons
        reduceTestedAgesByTestSpeedDivisor = function(testAge) {
            return (testAge / testSpeedDivisor).toString();
        },
        secondsToMilliseconds = function(seconds) {
            return seconds * 1000  / testSpeedDivisor;
        },
        secondsToMillisecondsFormatted = function(seconds) {
            return secondsToMilliseconds(seconds).toString() + ' milliseconds';
        };

    reduceTestDataByTestSpeedDivisor();

    describe('Animation', function () {
        this.timeout(100000);

        beforeEach(function(done) {
            TestTools.loadTestFixtures(Data, function() {
                done();
            });
        });

        describe('total run time ' + secondsToMillisecondsFormatted(92), function() {
            describe('after the play button is clicked', function () {

                describe('the bottom pane text', function() {
                    it('should change to the word: pause', function () {
                        $('#timeline-bottom-pane').click();

                        expect($('#timeline-bottom-pane-text').text()).to.equal('pause');
                    });
                });

                describe('the top pane text', function() {
                    it('should say: "at age ' + reduceTestedAgesByTestSpeedDivisor(0) + ', Chip was born"', function () {
                        $('#timeline-bottom-pane').click();
                        expect($('#timeline-top-pane-text').text()).to.equal('at age ' + reduceTestedAgesByTestSpeedDivisor(0) + ', Chip was born');
                    });
                });

                describe('after ' + secondsToMillisecondsFormatted(10), function() {
                    describe('the pause button is clicked', function() {
                        describe('after ' + secondsToMillisecondsFormatted(20), function() {
                            describe('the play button is clicked', function() {
                                describe('after ' + secondsToMillisecondsFormatted(8), function() {
                                    describe('the top pane text', function() {
                                        it('should say: "at age ' + reduceTestedAgesByTestSpeedDivisor(4) + ', Chip learned to ride a bike"', function (done) {
                                            // the first event should display for 8000 milliseconds
                                            // the second event should display for 16000 milliseconds

                                            // click play
                                            $('#timeline-bottom-pane').click();

                                            // wait 10,0000 milliseconds
                                            // having some issues using multiple requestanimationframe's currently.  debug later.
                                            // back to set timeout for now
                                            setTimeout(function() {
                                                // click pause
                                                $('#timeline-bottom-pane').click();

                                                // wait 20,0000 milliseconds
                                                setTimeout(function () {
                                                    // click play
                                                    $('#timeline-bottom-pane').click();

                                                    // wait 8000 milliseconds
                                                    setTimeout(function() {
                                                        expect($('#timeline-top-pane-text').text()).to.equal('at age ' +
                                                            reduceTestedAgesByTestSpeedDivisor(4) + ', Chip learned to ride a bike');
                                                        done();
                                                    }, secondsToMilliseconds(8));
                                                }, secondsToMilliseconds(20));
                                            }, secondsToMilliseconds(10));
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

                describe('after  ' + secondsToMillisecondsFormatted(2), function() {
                    describe('the pause button is clicked', function() {
                        describe('the bottom pane text', function () {
                            it('should change to the word: "play"', function (done) {
                                $('#timeline-bottom-pane').click();

                                setTimeout(function () {
                                    $('#timeline-bottom-pane').click();

                                    expect($('#timeline-bottom-pane-text').text()).to.equal('play');
                                    done();
                                }, secondsToMilliseconds(2));
                            });
                        });

                        describe('after  ' + secondsToMillisecondsFormatted(10), function() {
                            describe('the top pane text', function() {
                                it('should say: "at age ' + reduceTestedAgesByTestSpeedDivisor(0) + ', Chip was born"', function (done) {
                                    // this should play for 2,000 milliseconds, then pause
                                    // then wait for 10,000 milliseconds

                                    // click play
                                    $('#timeline-bottom-pane').click();

                                    // wait 2,000 milliseconds
                                    setTimeout(function() {
                                        // click pause
                                        $('#timeline-bottom-pane').click();

                                        // wait 10,000 milliseconds
                                        setTimeout(function () {
                                            expect($('#timeline-top-pane-text').text()).to.equal('at age ' +
                                                reduceTestedAgesByTestSpeedDivisor(0) + ', Chip was born');
                                            done();
                                        },  secondsToMilliseconds(10));
                                    },  secondsToMilliseconds(2));
                                });
                            });

                            describe('the play button is clicked', function() {
                                describe('after ' + secondsToMillisecondsFormatted(8), function() {
                                    it('should say: "at age ' + reduceTestedAgesByTestSpeedDivisor(4) + ', ' +
                                        'Chip learned to ride a bike"', function (done) {
                                        // click play
                                        $('#timeline-bottom-pane').click();

                                        // wait 2 seconds
                                        setTimeout(function() {
                                            // click pause.  6 seconds remaining for the first animation.
                                            $('#timeline-bottom-pane').click();

                                            // wait 10 seconds.  still 6 seconds remaining for the first animation.
                                            setTimeout(function () {
                                                // click play
                                                $('#timeline-bottom-pane').click();

                                                // wait 8 seconds.  second animation triggered 2 seconds ago.
                                                setTimeout(function() {
                                                    expect($('#timeline-top-pane-text').text()).to.equal('at age ' +
                                                        reduceTestedAgesByTestSpeedDivisor(4) + ', Chip learned to ride a bike');
                                                    done();
                                                }, secondsToMilliseconds(8));
                                            }, secondsToMilliseconds(10));
                                        }, secondsToMilliseconds(2));
                                    });
                                });
                            });
                        });
                    });
                });

                describe('after ' + secondsToMillisecondsFormatted(10), function () {
                    describe('the top pane text', function () {
                        it('should say: "at age ' + reduceTestedAgesByTestSpeedDivisor(4) +
                            ', Chip learned to ride a bike"', function (done) {
                            $('#timeline-bottom-pane').click();

                            setTimeout(function() {
                                expect($('#timeline-top-pane-text').text()).to.equal('at age ' +
                                    reduceTestedAgesByTestSpeedDivisor(4) + ', Chip learned to ride a bike');

                                done();
                            }, secondsToMilliseconds(10));
                        });
                    });
                });

                describe('after ' + secondsToMillisecondsFormatted(100), function () {
                    describe('the top pane text', function () {
                        it('should say: "at age ' + reduceTestedAgesByTestSpeedDivisor(42) +
                            ', Chip turned 42 years old"', function (done) {
                            $('#timeline-bottom-pane').click();

                            setTimeout(function() {
                                expect($('#timeline-top-pane-text').text()).to.equal('at age ' +
                                    reduceTestedAgesByTestSpeedDivisor(42) + ', Chip turned 42 years old');

                                done();
                            }, secondsToMilliseconds(100));
                        });
                    });

                    describe('the bottom pane text', function () {
                        it('should say: "restart"', function (done) {
                            // click play
                            $('#timeline-bottom-pane').click();

                            // wait 100 seconds
                            setTimeout(function() {
                                expect($('#timeline-bottom-pane-text').text()).to.equal('restart');

                                done();
                            }, secondsToMilliseconds(100));
                        });
                    });

                    describe('after clicking the restart button, the top pane text', function() {
                        it('should say: "at age ' + reduceTestedAgesByTestSpeedDivisor(0) +
                            ', Chip was born"', function(done) {
                            // click play
                            $('#timeline-bottom-pane').click();

                            // wait 100 seconds
                            setTimeout(function() {
                                // click restart
                                $('#timeline-bottom-pane').click();

                                // wait 2 seconds
                                setTimeout(function() {
                                    expect($('#timeline-top-pane-text').text()).to.equal('at age ' +
                                        reduceTestedAgesByTestSpeedDivisor(0) + ', Chip was born');
                                    done();
                                }, secondsToMilliseconds(2));
                            }, secondsToMilliseconds(100));
                        });
                    });
                });
            });
        });

        afterEach(function() {
            TestTools.teardownTestFixtures();
        });
    });
});
