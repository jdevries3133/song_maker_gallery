#!/bin/sh

curl -s -L https://github.com/mozilla/geckodriver/releases/download/v0.30.0/geckodriver-v0.30.0-linux64.tar.gz | tar -xz
ls -al
chmod +x geckodriver
mv geckodriver /usr/bin
