# Timeline App

## Installation
```bash
git clone https://github.com/davidjnelson/timeline-tech-challenge.git
cd timeline-tech-challenge
npm install
bower install
```

## Running the app
```bash
gulp start-web-server
```

Visit http://localhost:8000 in your web browser.

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

## Running integration and unit tests
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
- add more functional tests.  I was using the approach of writing failing functional tests first, then filling them
in with failing integration then unit tests.  Due to the learning curve of the functional testing tools, I stopped
writing functional tests altogether.  I do believe this approach has value.  However, the learning curve must be
mitigated for it to be a successful approach.
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
- make chrome launch for the local functional tests instead of launching firefox
- make specs not need to end in Spec.js
- share requirejs paths between test-main and main.js
- add tests for horizontally centering the two text nodes
- add media queries and/or javascript to adjust the font sizes as the viewport shrinks and expands, for mobile especially
- add an integration test for the mouse cursor to turn into the hand icon when you roll over the action button
- fix functional test watch - was working before...
- add integration test for click color changing
- write an ajax service to fetch the json.  currently if a requirejs build was setup, it would be inlined
 into the build output file during the build using the requirejs text plugin.  in the ajax service, include a
 loading indicator, error handling with retry, with integration tests for both.
- get the unit and integration tests running in under 200 milliseconds.  currently at 4 seconds.
- figure out why karma, when in watch mode, does not pass the tests 100% of the time.  when run from the browser in
the debug view, it works 100% of the time.  After restarting karma, it fixes it.  When karma is run in
continuous integration mode, where it starts chrome and karma each time it runs the tests, they pass 100% of the time.
- make the functional tests against sauce labs work. they were working at one point.  may need to install sauce connect
or use it to test apps deployed on the internet.

## Notes
- I wanted to write this in es6 and cross compile it with traceur, but I felt that was outside the scope of the
allowed libraries.
- There were no testing, build tool or package manager limitations mentioned, so I chose what I felt were the best
tools for the job.
- I realized I was spending far too much time getting the functional tests working, so I punted on that and focused
instead on the integration tests, unit tests, and application itself in the interest of time.  I could have finished
this much faster had I skipped the functional test tooling setup and functional test implementation completely.
