'use strict';

define(['components/timeline/TimelineView', 'components/timeline/TimelineData', 'components/timeline/TimelinePlayer',
        'components/timeline/TimelinePlayerState', 'components/timeline/TimelineEventCalculator', 'jquery'],
    function(TimelineView, TimelineData, TimelinePlayer, TimelinePlayerState, TimelineEventCalculator, $) {
    var timelineData,
        timelineEventCalculator,
        timelinePlayerState,
        timelinePlayer,
        timelineView;

    return {
        start: function(ServerData, loadedEventHandler) {
            timelineData = new TimelineData(ServerData);
            timelineEventCalculator = new TimelineEventCalculator(timelineData);
            timelinePlayerState = new TimelinePlayerState(timelineEventCalculator.calculateEventPlaybackTimes());
            timelinePlayer = new TimelinePlayer(timelineData, timelinePlayerState);
            timelineView = new TimelineView($('body'), timelinePlayerState, loadedEventHandler, timelineData, timelinePlayer);
            timelineView.render();
        },
        stop: function() {
            timelineView.destroy();

            // hint the garbage collector
            timelineData = null;
            timelinePlayerState = null;
            timelinePlayer = null;
            timelineView = null;
        }
    }
});
