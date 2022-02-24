# E2E Tests

Are what lives here. Put unit tests inside the app that they belong to.

## End to End Testing Stack

Dependencies

- Selenium / python
- Chrom(ium) / chromedriver

The test cases also use `django.test.LiveServerTestCase` which takes care
of serving the django project and wiping the database after each test case.

**The setup script will do this for you,** but if you are setting up manually,
make sure that `yarn build` or `yarn dev` has been run at least once
so that you have a frontend bundle on your machine.
