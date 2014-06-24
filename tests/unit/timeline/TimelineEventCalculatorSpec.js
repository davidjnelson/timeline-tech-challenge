'use strict';

define(['components/timeline/TimelineEventCalculator', 'components/timeline/TimelineData',
    'text!components/timeline/TimelineData.json', 'chai'], function(TimelineEventCalculator, TimelineData, TimelineServerData, chai) {
    var expect = chai.expect,
        timelineData,
        timelineEventCalculator,
        processedEvents;

    describe('Timeline Model', function() {
        beforeEach(function() {
            timelineData = new TimelineData(TimelineServerData);
            timelineEventCalculator = new TimelineEventCalculator(timelineData);
            processedEvents = timelineEventCalculator.calculateEventPlaybackTimes();
        });

        it('should set the playback time to the right interval for each age and associated event according to the algorithm', function() {
            expect(processedEvents[0].playbackTime).to.equal(8);
            expect(processedEvents[4].playbackTime).to.equal(16);
            expect(processedEvents[12].playbackTime).to.equal(10);
            expect(processedEvents[17].playbackTime).to.equal(8);
            expect(processedEvents[21].playbackTime).to.equal(12);
            expect(processedEvents[27].playbackTime).to.equal(10);
            expect(processedEvents[32].playbackTime).to.equal(10);
            expect(processedEvents[37].playbackTime).to.equal(10);
            expect(processedEvents[42].playbackTime).to.equal(8);
        });
    });
});
