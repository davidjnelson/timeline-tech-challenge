'use strict';

define(['views/TimelineView', 'models/TimelineModel', 'jquery'], function(TimelineView, TimelineModel, $) {
    return {
        start: function(TimelineData) {
            TimelineModel.refreshDataFromServer(TimelineData);
            var timelineView = new TimelineView($('body'), TimelineModel);
            timelineView.render();
        }
    }
});
