import os

from .base import BASE_DIR


ALLOWED_HOSTS = ["songmakergallery.com"]
CORS_ORIGIN_ALLOW_ALL = False


EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST = "smtp.gmail.com"
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"


from .secret import PG_PASSWORD, PG_USER, PG_NAME
from .config import PG_HOST

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": PG_NAME,
        "USER": PG_USER,
        "PASSWORD": PG_PASSWORD,
        "HOST": PG_HOST,
    }
}


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file_logger": {
            "level": 0,
            "class": "logging.FileHandler",
            "filename": os.path.join(BASE_DIR, "main.log"),
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["file_logger"],
        "level": "ERROR",
        "propagate": True,
    },
    "loggers": {
        "file": {
            "handlers": ["file_logger"],
            "level": "ERROR",
            "propagate": True,
        },
    },
}
