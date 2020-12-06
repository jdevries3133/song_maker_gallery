from django.core.management.base import BaseCommand, CommandError

import requests

class Command(BaseCommand):
    help = (
        'Check if the server\'s public ip address has changed, and update the '
        'record in Google Domains if it has.'
    )

    def handle(self, *a, **kw):
        last_ip = self._load_last_ip()
        cur_ip = requests.get('http://checkip.amazonaws.com/')

    def _load_last_ip(self):
        try:
            with open(Path(Path(__file__).parent, 'last_ip.json'), 'r') as jsn:
                return json.load(jsn)['last_ip']
        except OSError:  # file not found, etc...
            return '0'

