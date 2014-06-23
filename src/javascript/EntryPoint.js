'use strict';

define(['components/timeline/TimelineView', 'components/timeline/TimelineData', 'components/timeline/TimelineModel', 'jquery'],
    function(TimelineView, TimelineData, TimelineModel, $) {
    var timelineView,
        timelineModel,
        timelineData;

    return {
        start: function(ServerData, loadedEventHandler) {
            timelineData = new TimelineData(ServerData);
            timelineModel = new TimelineModel(ServerData, timelineData);
            timelineView = new TimelineView($('body'), timelineModel, loadedEventHandler, timelineData);
            timelineView.render();
        },
        stop: function() {
            timelineView.destroy();
            // make 100% sure the garbage collector knows to delete these
            timelineView = null;
            timelineModel = null;
        }
    }
});
