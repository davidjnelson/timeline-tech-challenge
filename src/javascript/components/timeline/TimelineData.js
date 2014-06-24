'use strict';

define([], function() {
    var _timelineData,
        _safeParseJson = function(json) {
            if(typeof json === 'object') {
                return json;
            }

            return JSON.parse(json);
        },
        TimelineData = function(timelineServerData) {
            _timelineData = _safeParseJson(timelineServerData);
        };

    Object.defineProperty(TimelineData.prototype, 'events', {
        get: function() {
            return _timelineData.events;
        }
    });

    Object.defineProperty(TimelineData.prototype, 'fullName', {
        get : function() {
            return _timelineData.firstName + ' ' + _timelineData.lastName;
        }
    });

    Object.defineProperty(TimelineData.prototype, 'age', {
        get : function() {
            return _timelineData.age;
        }
    });

    Object.defineProperty(TimelineData.prototype, 'firstName', {
        get : function() {
            return _timelineData.firstName;
        }
    });

    return TimelineData;
});
