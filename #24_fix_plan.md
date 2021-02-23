The site as it is should fail unit tests, but it doesn't. This is a symptom
of a lack of test coverage.

Investigate the cause, implement a test that fails as things are now, then
actually complete the transaction features to prevent a race condition as
per #24.
