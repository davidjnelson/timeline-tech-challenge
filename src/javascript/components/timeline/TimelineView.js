'use strict';

define(['text!components/timeline/TimelineViewTemplate.html', 'shared/MicrosecondTimer', 'jquery'], function(TimelineViewTemplate, MicrosecondTimer, $) {
    var _timelinePlayer,
        _timelineData,
        _parentElement,
        _templatedRendered = false,
        _loadedEventHandler,
        // no need for a templating engine here as we're just replacing two values
        _updateTemplate = function() {
            if(_templatedRendered) {
                $('#timeline-top-pane-text').text(_getTopPaneText());
                $('#timeline-bottom-pane-text').text(_getBottomPaneText());
            } else {
                var updatedTemplate = TimelineViewTemplate.replace('%%TOP_PANE_TEXT%%', _getTopPaneText())
                    .replace('%%BOTTOM_PANE_TEXT%%', _getBottomPaneText());

                _parentElement.append(updatedTemplate);
                _wireBottomPaneClick();
                _templatedRendered = true;

                if(_loadedEventHandler) {
                    _loadedEventHandler();
                }
            }
        },
        _getBottomPaneText = function() {
            switch(_timelinePlayer.getPlayerState()) {
                case _timelinePlayer.NOT_STARTED:
                case _timelinePlayer.PAUSED: {
                    return 'play';
                }
                case _timelinePlayer.PLAYING: {
                    return 'pause';
                }
                case _timelinePlayer.COMPLETED: {
                    return 'restart';
                }
            }
        },
        _getTopPaneText = function() {
            switch(_timelinePlayer.getPlayerState()) {
                case _timelinePlayer.PLAYING:
                case _timelinePlayer.COMPLETED:
                case _timelinePlayer.PAUSED: {
                    return 'at age ' + _timelinePlayer.getCurrentEventAge() + ', ' + _timelineData.getFirstName() + ' ' +
                        _timelineData.getActivityForAge(_timelinePlayer.getCurrentEventAge());
                }
                case _timelinePlayer.NOT_STARTED: {
                    return _timelineData.getFullName();
                }
            }
        },
        _showclickedAnimation = function() {
            $('#timeline-bottom-pane').toggleClass('timeline-bottom-pane-unclicked');
            $('#timeline-bottom-pane').addClass('timeline-bottom-pane-clicked');

            new MicrosecondTimer(function() {
                $('#timeline-bottom-pane').removeClass('timeline-bottom-pane-clicked');
                $('#timeline-bottom-pane').addClass('timeline-bottom-pane-unclicked');
            }, 100).execute();
        },
        _wireBottomPaneClick = function() {
            $('#timeline-bottom-pane').click(function () {
                _timelinePlayer.togglePlayingPaused();
                _showclickedAnimation();
            });
        },
        _handleModelEvents = function(eventData) {
            _updateTemplate();
        },
        TimelineView = function (parentElement, timelinePlayer, loadedEventHandler, timelineData) {
            _timelinePlayer = timelinePlayer;
            _parentElement = parentElement;
            _timelinePlayer.handleModelEvents(_handleModelEvents);
            _loadedEventHandler = loadedEventHandler;
            _timelineData = timelineData;
        };

    TimelineView.prototype.render = function() {
        _updateTemplate();
    };

    TimelineView.prototype.destroy = function() {
        _parentElement.empty();
        _templatedRendered = false;
    };

    return TimelineView;
});
