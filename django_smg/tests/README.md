# Integration Tests

Are what lives here. Put unit tests inside the app that they belong to.

## Testing Stack

Integration tests use:

- Selenium / python
- Chrom(ium) / chromedriver

The test cases also use `django.test.LiveServerTestCase` which takes care
of serving the django project and wiping the database after each test case.
