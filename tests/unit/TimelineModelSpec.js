define(['models/TimelineModel', 'text!json/SmallData.json'], function(TimelineModel, SmallData) {
    var toFiveDecimals = function(number) {
        // five decimals of precision is precise enough for this test
        return parseFloat(number.toFixed(5));
    };

    describe('Timeline Model', function() {
        describe('when the data is set very small for test speed', function() {
            it('should set the playback time to the right interval for each age and associated event', function() {
                TimelineModel.refreshDataFromServer(SmallData);

                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(0))).toEqual(0.00008);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00004))).toEqual(0.00016);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00012))).toEqual(0.00010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00017))).toEqual(0.00008);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00021))).toEqual(0.00012);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00027))).toEqual(0.00010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00032))).toEqual(0.00010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00037))).toEqual(0.00010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.00042))).toEqual(0.00008);
            });
        });

        describe('when the described person is 46 years old', function() {
            beforeEach(function() {
                TimelineModel.refreshDataFromServer(SmallData);
            })
            it('should it should have a total playback time of 92 seconds', function() {
                expect(TimelineModel.getTotalPlaybackTime()).toEqual(0.00092);
            });
        });
    });
});
