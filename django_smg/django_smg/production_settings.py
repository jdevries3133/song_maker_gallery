import os

# Email
# EMAIL_PORT = 587
# EMAIL_HOST_USER = config['SMG_GMAIL']
# EMAIL_USE_TLS = True
# EMAIL_HOST = config['SMTP_HOST']
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'songmaker',
        'USER': 'songmaker',
        'HOST': 'localhost',
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
