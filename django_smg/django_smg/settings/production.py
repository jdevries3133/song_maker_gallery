import os

from .base import BASE_DIR


ALLOWED_HOSTS = ['songmakergallery.com']


from .secret import (
    EMAIL_HOST_USER,
    EMAIL_HOST_PASSWORD
)
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


from .secret import (
    MYSQL_PASSWORD,
    MYSQL_USER,
    MYSQL_NAME
)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': MYSQL_NAME,
        'USER': MYSQL_USER,
        'PASSWORD': MYSQL_PASSWORD,
        'HOST': '127.0.0.1',
        'PORT': 3306,
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode=\"STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO\""
        },
        'TEST': {
            'CHARSET': 'utf8mb4',
            'COLLATION': 'utf8mb4_unicode_ci',
        }
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
        'file_logger': {
            'level': 0,
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'main.log'),
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file_logger'],
        'level': 'ERROR',
        'propagate': True,
    },
    'loggers': {
        'file': {
            'handlers': ['file_logger'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
