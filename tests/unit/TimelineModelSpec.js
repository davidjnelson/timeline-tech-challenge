'use strict';

define(['components/timeline/TimelineData', 'text!components/timeline/TimelineData.json', 'chai'], function(TimelineData, TimelineServerData, chai) {
    var expect = chai.expect,
        timelineData;

    describe('Timeline Model', function() {
        beforeEach(function() {
            timelineData = new TimelineData(TimelineServerData);
        });

        it('should set the playback time to the right interval for each age and associated event according to the algorithm', function() {
            expect(timelineData.getPlaybackTimeForAge(0)).to.equal(8);
            expect(timelineData.getPlaybackTimeForAge(4)).to.equal(16);
            expect(timelineData.getPlaybackTimeForAge(12)).to.equal(10);
            expect(timelineData.getPlaybackTimeForAge(17)).to.equal(8);
            expect(timelineData.getPlaybackTimeForAge(21)).to.equal(12);
            expect(timelineData.getPlaybackTimeForAge(27)).to.equal(10);
            expect(timelineData.getPlaybackTimeForAge(32)).to.equal(10);
            expect(timelineData.getPlaybackTimeForAge(37)).to.equal(10);
            expect(timelineData.getPlaybackTimeForAge(42)).to.equal(8);
        });

        describe('when the described person is 46 years old', function() {
            it('should it should have a total playback time of 92 seconds', function() {
                expect(timelineData.getTotalPlaybackTime()).to.equal(92);
            });
        });
    });
});
