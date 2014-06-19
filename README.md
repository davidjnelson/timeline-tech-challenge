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

## Remaining nice to haves
- complete the actual app!
- complete the integration tests
- complete the functional tests
- add unit tests to check for xss, boundary conditions, etc.
- concatenation and minification with source maps
- linting
- code coverage analysis
- deployment to s3 with cloudfront backing
- version increments on build
- configure chrome windows and linux as well as the currently configured chrome osx
- deploy to continuous integration
- re run functional tests after deployment
- make chrome launch for the local functional tests instead of being set to IE and launching firefox
- make specs not need to end in Spec.js
- share requirejs paths between test-main and main.js
- consider switching integration tests to mocha due to better async support
- consider adding tests for horizontally centered the two text nodes
- add media queries and/or javascript to adjust the font sizes as the viewport shrinks and expands, for mobile especially
- add a test for the mouse cursor to turn into the hand icon when you roll over the action button
- fix functional test watch - was working before...
