define(['text!json/SmallData.json', 'testing/TestTools', 'chai', 'jquery'], function(SmallData, TestTools, chai, $) {
    var expect = chai.expect;

    describe('Animation', function () {
        beforeEach(function(done) {
            TestTools.loadTestFixtures(SmallData, function() {
                done();
            });
        });

        describe('after the play button is clicked', function () {

            describe('the bottom pane text', function() {
                it('should change to the word: pause', function () {
                    $('#timeline-bottom-pane').click();

                    expect($('#timeline-bottom-pane-text').text()).to.equal('pause');
                });
            });

            describe('the top pane text', function() {
                it('should say: "at age 0, Chip was born"', function () {
                    $('#timeline-bottom-pane').click();
                    expect($('#timeline-top-pane-text').text()).to.equal('at age 0, Chip was born');
                });
            });

            describe('after 20 milliseconds', function() {
                describe('the pause button is clicked', function() {
                    describe('the bottom pane text', function () {
                        it('should change to the word: "play"', function (done) {
                            $('#timeline-bottom-pane').click();

                            setTimeout(function () {
                                $('#timeline-bottom-pane').click();

                                expect($('#timeline-bottom-pane-text').text()).to.equal('play');
                                done();
                            }, 20);
                        });
                    });

                    describe('after 100 milliseconds', function() {
                        describe('the top pane text', function() {
                            it('should say: "at age 0, Chip was born"', function (done) {
                                $('#timeline-bottom-pane').click();

                                setTimeout(function() {
                                    $('#timeline-bottom-pane').click();

                                    setTimeout(function () {
                                        expect($('#timeline-top-pane-text').text()).to.equal('at age 0, Chip was born');
                                        done();
                                    }, 100);
                                }, 20);
                            });
                        });
                    })
                });
            });

            describe('after 100 milliseconds', function () {
                describe('the top pane text', function () {
                    it('should say: "at age .04, Chip learned to ride a bike"', function (done) {
                        $('#timeline-bottom-pane').click();

                        setTimeout(function() {
                            expect($('#timeline-top-pane-text').text()).to.equal('at age 0.04, Chip learned to ride a bike');

                            done();
                        }, 100);
                    });
                });
            });

            describe('after 1 second', function () {
                describe('the top pane text', function () {
                    it('should say: "at age 0.42, Chip turned 42 years old"', function (done) {
                        $('#timeline-bottom-pane').click();

                        setTimeout(function() {
                            expect($('#timeline-top-pane-text').text()).to.equal('at age 0.42, Chip turned 42 years old');

                            done();
                        }, 1000);
                    });
                });

                describe('the bottom pane text', function () {
                    it('should say: "restart"', function (done) {
                        $('#timeline-bottom-pane').click();

                        setTimeout(function() {
                            expect($('#timeline-bottom-pane-text').text()).to.equal('restart');

                            done();
                        }, 1000);
                    });
                });

                describe('after clicking the restart button, the top pane text', function() {
                    it('should say: "at age 0, Chip was born"', function(done) {
                        this.timeout(2000);
                        $('#timeline-bottom-pane').click();

                        setTimeout(function() {
                            $('#timeline-bottom-pane').click();

                            setTimeout(function() {
                                expect($('#timeline-top-pane-text').text()).to.equal('at age 0, Chip was born');
                                done();
                            }, 20);
                        }, 1000);
                    });
                });
            });
        });

        afterEach(function() {
            TestTools.teardownTestFixtures();
        });
    });
});
