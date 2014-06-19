define([], function() {
    return {
        refreshDataFromServer: function(timelineServerData) {
            // since we don't currently need to fetch data more than once per application run according to the spec,
            // this can be kept simple for now
            this.timelineModel = JSON.parse(timelineServerData);
        },
        getTimelineModel: function() {
            return this.timelineModel;
        }
    };
});
