define(['text!templates/TimelineViewTemplate.html'], function(TimelineViewTemplate) {
    return {
        render: function(rootElement) {
            rootElement.append(TimelineViewTemplate);
        }
    };
});
