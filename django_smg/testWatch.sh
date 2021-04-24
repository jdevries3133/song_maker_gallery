#!/bin/bash

# Like jest --watch. Re-runs tests whenever a python file is changed.
# Note that this is dependent on entr for watching file changes, so install
# that with your package manager first.

find . -name '*.py' | grep -v venv | entr python ./manage.py test
