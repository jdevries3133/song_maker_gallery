echo "WARNING: This script creates an insecure database suitable for development and testing only. Read the direction in the README adjacent to this script to learn more."


docker run \
    -d \
    --name songmaker-dev-db \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=devpasswd \
    postgres:14
