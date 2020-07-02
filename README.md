# Deployment Checklist

### Move Shell Scripts

- backendcron.sh
- botcron.sh

### Move config.json files

- integrated_django_react/integrated_django_react/config.json
- screesnhot-bot/screesnhot-bot/config.json

### Apache

- Install and configure

### Misc

- Update ~/.bashrc

- Consider setting up daemon for screenshot bot rather than cron job. If cron jobs overlap, it's not good.
