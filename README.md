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
```
gulp functional-test-all-browsers
```

## Remaining nice to haves
- actual app!
- watch for changes and re-run functional tests
- unit tests
- concatenation and minification with source maps
- module loading
- linting
- code coverage analysis
- deployment to s3 with cloudfront backing
- version increments on build
- watch for changes and re-run unit tests
- configure chrome windows and linux as well as the currently configured chrome osx
- deploy to continuous integration
- re run functional tests after deployment
- make chrome launch for the local functional tests instead of being set to IE and launching firefox
- make specs not need to end in Spec.js
- share requirejs paths between test-main and main.js
- consider switching integration tests to mocha due to better async support
