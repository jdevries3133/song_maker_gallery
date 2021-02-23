#!/bin/bash

docker ps | grep "songmaker-dev-db"  | cut -c 1-10 | xargs docker kill | xargs docker rm
