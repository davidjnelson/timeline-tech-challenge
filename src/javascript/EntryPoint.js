define(['views/TimelineView', 'models/TimelineModel', 'jquery'], function(TimelineView, TimelineModel, $) {
    return {
        start: function(TimelineData) {
            TimelineModel.refreshDataFromServer(TimelineData);
            TimelineView.render($('body'), TimelineModel.getTimelineModel());
        }
    }
});
