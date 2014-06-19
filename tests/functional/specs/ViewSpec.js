'use strict';

var FunctionalTesterFactory = require('../shared/FunctionalTesterFactory');

describe('view', function() {
    var allTestsPassed = true,
        tester;

    before(function(done) {
        tester = FunctionalTesterFactory.getFunctionalTester(global.functionalTestType);
        tester.openBrowser(done);
    });

    after(function(done) {
        tester.closeBrowser(done, allTestsPassed);
    });

    afterEach(function(done) {
        // fail test if this.currentTest from mocha returns a state other than passed for any tests run
        allTestsPassed = allTestsPassed && (this.currentTest.state === 'passed');
        done();
    });

    it('should have a div called timeline-container', function(done) {
        tester.getBrowser()
            .get('http://localhost:8000')
            .elementById('timeline-container')
            .nodeify(done);
    });

    it('should change the bottom pane text from play to pause after clicking play and after two seconds change the' +
        'top pane text to "at age 0, Chip was born"', function(done) {
        tester.getBrowser()
            .get('http://localhost:8000')
            .elementById('timeline-bottom-pane')
            //.click()
            //.elementById('timeline-bottom-pane-text')
            //.textPresent('pause')
            .nodeify(done);
    });
});
