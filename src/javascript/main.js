'use strict';

requirejs.config({
    paths: {
        'jquery': '../../bower_components/jquery/dist/jquery',
        'text': '../../bower_components/requirejs-text/text'
    },
    shim: {
        jquery: {
            export: '$'
        }
    }
});

define(['EntryPoint', 'text!components/timeline/TimelineData.json'], function (EntryPoint, TimelineData) {
    EntryPoint.start(TimelineData);
});
