'use strict';

define(['components/timeline/TimelineView', 'components/timeline/TimelineData', 'components/timeline/TimelinePlayer', 'jquery'],
    function(TimelineView, TimelineData, TimelinePlayer, $) {
    var timelineData,
        timelinePlayer,
        timelineView;

    return {
        start: function(ServerData, loadedEventHandler) {
            timelineData = new TimelineData(ServerData);
            timelinePlayer = new TimelinePlayer(timelineData);
            timelineView = new TimelineView($('body'), timelinePlayer, loadedEventHandler, timelineData);
            timelineView.render();
        },
        stop: function() {
            timelineView.destroy();
        }
    }
});