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

define(['views/TimelineView', 'jquery'], function (TimelineView, $) {
    TimelineView.render($('body'));
});
