I am flipping teacher around after realizing that 99% of the stuff in Teacher
should really belong to \<Add /\>.

This means a big refactor.

Tests are passing, but that is deceptive because they are running in isolation,
in some cases against what has now become graveyard code. The functionality
isn't really there, and things are not all hooked up as they should be.

However, styling is quite broken, also, the markup is also messed up
because there are still half-broken table layouts in \<Staged /\> and
\<ListGalleries /\>.
