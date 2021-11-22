import os
import sys

from .secret import SECRET_KEY

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEBUG = True if os.getenv("DJANGO_DEBUG") == "1" else False
if not DEBUG:
    from .production import *
else:
    from .development import *

SKIP_FETCH_AND_CACHE = False  # speeds up unit tests significantly

if not DEBUG and sys.platform == "linux":
    # require https in production. The linux check is kinda hacky but
    # prevents this from being set on my local machine when developing.
    # obviously, that won't help if you develop on linux
    SECURE_HSTS_SECONDS = 3600
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    CSRF_COOKIE_SECURE = True

ALLOWED_HOSTS = [
    "songmakergallery.com",
    "localhost",
]

if DEBUG:
    ALLOWED_HOSTS.append("*")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "knox",
    "rest_framework",
    "accounts",
    "frontend",
    "gallery",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "django_smg.urls"

REST_FRAMEWORK = {"DEFAULT_AUTHENTICATION_CLASSES": ("knox.auth.TokenAuthentication",)}

# Explicitly name default primary key setting; silences warning.
# https://dev.to/rubyflewtoo/upgrading-to-django-3-2-and-fixing-defaultautofield-warnings-518n
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "django_smg", "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "django_smg.wsgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static_root")
