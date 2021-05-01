"""
This is injected last automatically when you run tests with manage.py. It just
suppresses log messages because ideally, they don't need to be seen in most
cases.
"""
from .base import *

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'handlers': {
        'supress': {
            'level': 'CRITICAL',
            'class': 'logging.StreamHandler',
        },
    },
    '': {
        'handlers': ['supress'],
        'level': 'CRITICAL',
    },
    'root': {
        'handlers': ['supress'],
        'level': 'CRITICAL',
    },
    'django': {
        'handlers': ['supress'],
        'level': 'CRITICAL'
    },
}
