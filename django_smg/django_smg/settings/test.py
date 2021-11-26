from .base import *

# Quiet logging
import logging

logging.disable(logging.CRITICAL)


DEBUG = False
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]
