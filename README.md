# Timeline App

## Installation
```bash
git clone https://github.com/davidjnelson/timeline-tech-challenge/timeline-tech-challenge.git
npm install
```

## Running local functional tests
```bash
gulp start-selenium (once)
gulp functional-test-local (repeatedly)
```

## Running functional tests through sauce labs to test all supported browsers
```bash
gulp functional-test-all-browsers
```

## Documentation on the selenium wire protocol
https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/text

## Documentation on webdriver for functional tests which uses the selenium wire protocol
https://github.com/admc/wd/blob/master/doc/api.md

## Running integration tests
```bash
karma start
```
Make sure not to open any other tabs in the window that karma is running in, or the tests will get very slow.

## Debugging integration tests in a browser
In a different browser window than the one karma is running in, type this in the browser:
```
http://localhost:9877/debug.html
```
It is _very_ important not to open any other tabs in the window karma is running in, or the tests will run slowly.

## Remaining nice to haves I would do with more time
- complete the actual app!
- complete the integration tests
- add more functional tests.  I was using the approach of writing failing functional tests first, then filling them
in with failing integration then unit tests.  Due to the learning curve of the functional testing tools and since the
recruiter said that time was of the essence, I stopped writing functional tests altogether.  I do believe this approach
has value.  However, the learning curve must be mitigated for it to be a successful approach.
- add unit tests to check for xss, boundary conditions, etc.
- concatenation and minification with source maps using r.js
- linting
- code coverage analysis
- code quality analysis, ie: cyclomatic complexity
- deployment to s3 with cloudfront backing
- version increments on build
- configure chrome windows and linux as well as the currently configured chrome osx
- deploy to continuous integration
- re run functional tests after deployment
- make chrome launch for the local functional tests instead of being set to IE and launching firefox
- make specs not need to end in Spec.js
- share requirejs paths between test-main and main.js
- consider switching integration tests to mocha due to better async support and unit tests to mocha for consistency
- consider adding tests for horizontally centered the two text nodes
- add media queries and/or javascript to adjust the font sizes as the viewport shrinks and expands, for mobile especially
- add a test for the mouse cursor to turn into the hand icon when you roll over the action button
- fix functional test watch - was working before...
- add integration test for click color changing
- organize the code into components instead of putting all models in one models directory etc.
- use more precision for the floating point numbers used during testing
- code reuse for a few test helper functions

## Notes
- I wanted to write this in es6 and cross compile it with traceur, but I felt that was outside the scope of the
allowed libraries.
- There were no testing, build tool or package manager limitations mentioned, so I chose what I felt were the best
tools for the job.
- I realized I was spending far too much time getting the functional tests working, so I punted on that and focused
instead on the integration tests, unit tests, and application itself in the interest of time.  I could have finished
this much faster had I skipped the functional test tooling setup and functional test implementation completely.
