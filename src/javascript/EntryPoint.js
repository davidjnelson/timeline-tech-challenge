'use strict';

define(['components/timeline/TimelineView', 'components/timeline/TimelineData', 'components/timeline/TimelinePlayer', 'jquery'],
    function(TimelineView, TimelineData, TimelinePlayer, $) {
    var timelineView,
        timelinePlayer,
        timelineData;

    return {
        start: function(ServerData, loadedEventHandler) {
            timelineData = new TimelineData(ServerData);
            timelinePlayer = new TimelinePlayer(ServerData, timelineData);
            timelineView = new TimelineView($('body'), timelinePlayer, loadedEventHandler, timelineData);
            timelineView.render();
        },
        stop: function() {
            timelineView.destroy();
            // make 100% sure the garbage collector knows to delete these
            timelineView = null;
            timelinePlayer = null;
        }
    }
});
