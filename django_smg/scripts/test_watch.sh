#!/bin/bash

# DEPENDENCY: must install 'entr' command line util.

# Like jest --watch. Re-runs tests whenever a python file is changed.
# Note that add'l args go into manage.py, all command line functionality is
# preserved, and you can hammer on a specific test suite or even test if
# needed

find . -name '*.py' | grep -v venv | entr python ./manage.py test $@
