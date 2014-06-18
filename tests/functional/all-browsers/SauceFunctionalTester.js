var FunctionalTester = require('../local/FunctionalTester');

function SauceFunctionalTester(testConfig) {
    FunctionalTester.call(this, testConfig);
}

SauceFunctionalTester.prototype = Object.create(FunctionalTester.prototype);
SauceFunctionalTester.prototype.constructor = SauceFunctionalTester;

SauceFunctionalTester.prototype.closeBrowser = function(doneCallback, allPassed) {
    this.browser
        .quit()
        .sauceJobStatus(allPassed)
        .nodeify(doneCallback);
};

module.exports = SauceFunctionalTester;