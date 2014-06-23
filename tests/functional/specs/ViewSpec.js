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
});
