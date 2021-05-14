import os

# inject type hints all over the place
import django_stubs_ext
django_stubs_ext.monkeypatch()


################################################################################

                        ## Configurable Settings ##

# see dev_db/README.md. This project has helper scripts for starting a MySQL
# instance in docker.
#
# When this is set to false, dbsqlite is used instead.
USE_MYSQL = True

# see Python's logging levels for valid strings to use
# https://docs.python.org/3/library/logging.html#logging-levels
LOG_LEVEL = 'DEBUG'

################################################################################


CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

ALLOWED_HOSTS = ['localhost']


EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

if USE_MYSQL:
    from .production import DATABASES
else:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console_logger': {
            'level': 0,
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console_logger'],
        'level': 'DEBUG',
        'propagate': True,
    },
    'loggers': {
        'file': {
            'handlers': ['console_logger'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}
