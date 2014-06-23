define(['text!components/timeline/TimelineData.json', 'testing/TestTools', 'chai', 'jquery'], function(TimelineData, TestTools, chai, $) {
    var expect = chai.expect;

    describe('Layout', function () {
        beforeEach(function(done) {
            TestTools.loadTestFixtures(TimelineData, function() {
                done();
            });
        });

        describe('after the application loads', function () {
            describe('the timeline-container div', function () {
                it('should have the same height as the viewport', function () {
                    expect(TestTools.getRectangleHeight('timeline-container')).to.be.closeTo(TestTools.getViewportHeight(), .001);
                });

                it('should have a first child div which is 75% height and 100% width', function() {
                    var seventyFivePercentOfContainerHeight = TestTools.convertToLessPrecision(
                            TestTools.getRectangleHeight('timeline-container') * .75);
                    expect(TestTools.getRectangleHeight('timeline-top-pane')).to.be.closeTo(seventyFivePercentOfContainerHeight, .001);
                    expect(TestTools.getRectangleWidth('timeline-top-pane')).to.be.closeTo(TestTools.getRectangleWidth('timeline-container'), .001);
                });

                it('should have a second child div which is 25% height and 100% width', function() {
                    var twentyFivePercentOfContainerHeight = TestTools.convertToLessPrecision(
                            TestTools.getRectangleHeight('timeline-container') * .25);
                    expect(TestTools.getRectangleHeight('timeline-bottom-pane')).to.be.closeTo(twentyFivePercentOfContainerHeight, .001);
                    expect(TestTools.getRectangleWidth('timeline-bottom-pane')).to.be.closeTo(TestTools.getRectangleWidth('timeline-container'), .001);
                });

                it('should have a first child div with the text "Chip Bitly"', function() {
                    expect($('#timeline-top-pane-text').text()).to.equal('Chip Bitly');
                });

                it('should have a second child div with the text "play"', function() {
                    expect($('#timeline-bottom-pane-text').text()).to.equal('play');
                });
            });
        });

        afterEach(function() {
            TestTools.teardownTestFixtures();
        });
    });
});