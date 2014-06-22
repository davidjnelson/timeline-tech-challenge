'use strict';

define(['models/TimelineModel', 'text!json/TimelineData.json', 'chai'], function(TimelineModel, TimelineData, chai) {
    var expect = chai.expect,
        timelineModel;

    describe('Timeline Model', function() {
        beforeEach(function() {
            timelineModel = new TimelineModel(TimelineData);
        });

        describe('when the data is set very small for test speed', function() {
            it('should set the playback time to the right interval for each age and associated event', function() {
                expect(timelineModel.getPlaybackTimeForAge(0)).to.equal(8);
                expect(timelineModel.getPlaybackTimeForAge(4)).to.equal(16);
                expect(timelineModel.getPlaybackTimeForAge(12)).to.equal(10);
                expect(timelineModel.getPlaybackTimeForAge(17)).to.equal(8);
                expect(timelineModel.getPlaybackTimeForAge(21)).to.equal(12);
                expect(timelineModel.getPlaybackTimeForAge(27)).to.equal(10);
                expect(timelineModel.getPlaybackTimeForAge(32)).to.equal(10);
                expect(timelineModel.getPlaybackTimeForAge(37)).to.equal(10);
                expect(timelineModel.getPlaybackTimeForAge(42)).to.equal(8);
            });
        });

        describe('when the described person is 46 years old', function() {
            it('should it should have a total playback time of 92 seconds', function() {
                expect(timelineModel.getTotalPlaybackTime()).to.equal(92);
            });
        });
    });
});
