#!/bin/sh

# this adds integration test dependencies into the dev container. After running
# this one, just running ./manage.py test will work thereafter

echo http://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories
apk update && apk upgrade

apk add firefox-esr jq xvfb curl openjdk8-jre
rm -rf /var/cache/apk/*

sh scripts/geckodriver_install.sh
