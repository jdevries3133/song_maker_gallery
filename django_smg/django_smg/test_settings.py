from .settings import *

SKIP_FETCH_AND_CACHE = True

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
