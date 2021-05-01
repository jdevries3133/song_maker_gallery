#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def _supress_logging_for_testing():
    sys.argv.append('--settings=django_smg.settings.test')
    print('Running tests with django_smg.test_settings to supress log output')

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_smg.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    if 'test' in sys.argv:
        _supress_logging_for_testing()
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
