define(['text!templates/TimelineViewTemplate.html'], function(TimelineViewTemplate) {
    return {
        render: function(rootElement, timelineModel) {
            var updatedTemplate = this.updateTemplate(timelineModel);
            rootElement.append(updatedTemplate);
        },
        // no need for a templating engine here as we're just replacing two values
        updateTemplate: function(timelineModel) {
            return TimelineViewTemplate.replace('%%TOP_PANE_TEXT%%', timelineModel.firstName + ' ' + timelineModel.lastName)
                .replace('%%BOTTOM_PANE_TEXT%%', 'play');
        }
    };
});
