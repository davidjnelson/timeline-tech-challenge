'use strict';

var FunctionalTesterFactory = require('../shared/FunctionalTesterFactory');

describe('nodejs.org tests', function() {
    var allTestsPassed = true,
        tester;

    before(function(done) {
        tester = FunctionalTesterFactory.getFunctionalTester(global.functionalTestType);
        tester.openBrowser(done);
    });

    afterEach(function(done) {
        // fail test if this.currentTest from mocha returns a state other than passed for any tests run
        allTestsPassed = allTestsPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function(done) {
        tester.closeBrowser(done, allTestsPassed);
    });

    it("should get home page", function(done) {
        tester.getBrowser()
            .get("http://nodejs.org/")
            .title()
            .should.become("node.js")
            .elementById("intro")
            .text()
            .should.eventually.include('JavaScript runtime')
            .nodeify(done);
    });

    it("should go to the doc page", function(done) {
        tester.getBrowser()
            .elementById('docsbutton')
            .click()
            .title()
            .should.eventually.include("Manual")
            .nodeify(done);
    });

    it("should return to the home page", function(done) {
        tester.getBrowser()
            .elementById('logo')
            .click()
            .title()
            .should.not.eventually.include("Manual")
            .nodeify(done);
    });
});
