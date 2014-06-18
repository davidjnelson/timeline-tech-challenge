var FunctionalTester = require('../local/FunctionalTester'),
    FunctionalTestConfig = require('../local/LocalFunctionalTestConfig'),
    SauceFunctionalTester = require('../all-browsers/SauceFunctionalTester'),
    SauceFunctionalTestConfig = require('../all-browsers/SauceFunctionalTestConfig');

module.exports = {
    getFunctionalTester: function(testType) {
        switch(testType) {
            case 'local': {
                return new FunctionalTester(FunctionalTestConfig);
            }
            case 'all-browsers': {
                return new SauceFunctionalTester(SauceFunctionalTestConfig);
            }
            default: {
                throw Error('unknown functional test type.  please specify "all-browsers" or "local".');
            }
        }
    }
};
