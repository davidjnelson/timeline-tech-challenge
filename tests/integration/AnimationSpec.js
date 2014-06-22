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
        });

        afterEach(function() {
            TestTools.teardownTestFixtures();
        });
    });
});
