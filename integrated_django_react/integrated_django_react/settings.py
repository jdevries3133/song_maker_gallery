import logging
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEBUG = True
if DEBUG:
    with open(os.path.join(BASE_DIR, 'integrated_django_react', 'dev_config.json'), 'r') as jsn:
        env = json.load(jsn)
        for k, v in env.items():
            if k == 'SCREENSHOT_BOT_URLS':
                SCREENSHOT_BOT_URLS = v
                continue
            os.environ[k] = v
else:
    with open(os.path.join(BASE_DIR, 'integrated_django_react', 'config.json'), 'r') as jsn:
        env = json.load(jsn)
        for k, v in env.items():
            if k == 'SCREENSHOT_BOT_URLS':
                SCREENSHOT_BOT_URLS = v
                continue
            os.environ[k] = v

SECRET_KEY = os.getenv('DJANGO_SECRET')
ALLOWED_HOSTS = [
    'django',
    'songmakergallery.com',
    'localhost'
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_mysql',
    'knox',
    'storages',
    'rest_framework',

    'accounts',
    'get_screenshots',
    'dynamic_ip_check',
    'frontend',
    'public_provider',
    'teacher_admin',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'integrated_django_react.urls'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'knox.auth.TokenAuthentication',
    )
}

CRON_CLASSES = [
    'get_screenshots.api.ScreenshotCron',
]

# Email
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('SMG_GMAIL')
EMAIL_HOST_PASSWORD = os.getenv('SMG_GMAIL_PASSWORD')
EMAIL_USE_TLS = True
EMAIL_HOST = os.getenv('SMTP_HOST')
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Amazon S3
"""
if not DEBUG:
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = 'song-maker-gallery'
    AWS_DEFAULT_ACL = 'public-read'
    AWS_S3_FILE_OVERWRITE = False
"""

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'integrated_django_react', 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'integrated_django_react.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQL_DATABASE'),
        'USER': os.getenv('MYSQL_USER'),
        'PASSWORD': os.getenv('MYSQL_PASSWORD'),
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

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': (
                '%(filepath)s::%(module)s\n\t%(levelname)s -> %(message)s'
            ),
        },
    },
    'handlers': {
        'stream': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'main.log'),
        },
    },
    'root': {
        'handlers': ['stream', 'file'],
        'level': 'ERROR',
        'propagate': True,
    },
    'loggers': {
        'file': {
            'handlers': ['stream', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}
