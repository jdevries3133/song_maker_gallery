# Test Against "Real" MySQL DB

By default, development settings use dbsqlite. This is fine for the most part,
but sometimes, you might want to run unit tests against a real mysqldb to
mimic the production environment better. If docker is installed on your
machine and port `3306` is free, do this:

1. In `django_smg/django_smg/development_settings.py`, switch the `USE_MYSQL` setting to `True`
2. Run the python script adjacent to this file (`start_db.py`)
3. Add the following to `django_smg/django_smg/secret_settings.py`
   (if you setup the project with `dev_setup.sh`, this should already  be there):

   ```python
   MYSQL_PASSWORD = 'passwd'
   MYSQL_USER = 'songmaker'
   MYSQL_NAME = 'songmaker'
   ```

4. That's it (hopefully)! Try `manage.py migrate`. If it doesn't work, wait a
   second. It takes ~30 seconds for the database to startup in the docker
   container on my machine.

**This uses Docker to spin up a disposable mysql db on 0.0.0.0:3306**
