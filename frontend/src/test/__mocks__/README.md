# Do not add to this folder!

`__mocks__` should be ADJACENT TO THE TRUE IMPLEMENTATION, not in a random
place. By doing that, jest can pick up on mocks automatically. There is no need
to manually import these and make them the mock implementation.

# Elminate This Folder

In the future, this folder should be eliminated, but a few tests are dependent
on it, and some of these mocks are actually dynamic abstractions which does
not exactly jive with the way Jest wants things to be done.

So, for now, they will stay.
