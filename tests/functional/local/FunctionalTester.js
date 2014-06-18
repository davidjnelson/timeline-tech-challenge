'use strict';

var wd = require('wd'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");

// node gives better stack traces when using named functions
function FunctionalTester(testConfig) {
    this.testConfig = testConfig;
    chai.use(chaiAsPromised);
    chai.should();
    chaiAsPromised.transferPromiseness = wd.transferPromiseness;
};

FunctionalTester.prototype.openBrowser = function(doneCallback) {
    this.browser = wd.promiseChainRemote(this.testConfig.seleniumServerAddress, this.testConfig.seleniumServerPort,
        this.testConfig.sauceUsername, this.testConfig.saucePassword);
    this.browser
        .init(this.testConfig.testParameters)
        .nodeify(doneCallback);
};

FunctionalTester.prototype.closeBrowser = function(doneCallback) {
    this.browser
        .quit()
        .nodeify(doneCallback);
};

FunctionalTester.prototype.getBrowser = function() {
    return this.browser;
};

module.exports = FunctionalTester;
