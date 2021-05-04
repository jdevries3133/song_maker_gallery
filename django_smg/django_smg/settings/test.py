from .base import *

# Quiet logging
import logging
logging.disable(logging.CRITICAL)

# Gotta go fast
DEBUG = False
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]
