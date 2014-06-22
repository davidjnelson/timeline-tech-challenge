'use strict';

define(['views/TimelineView', 'models/TimelineModel', 'jquery'], function(TimelineView, TimelineModel, $) {
    var timelineView,
        timelineModel;

    return {
        start: function(TimelineData, loadedEventHandler) {
            timelineModel = new TimelineModel(TimelineData);
            timelineView = new TimelineView($('body'), timelineModel, loadedEventHandler);
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
