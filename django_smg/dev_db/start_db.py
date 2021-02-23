import subprocess
from pathlib import Path

print(
    'WARNING: This script creates an insecure database suitable for '
    'development and testing only. Read the direction in the README adjacent '
    'to this script to learn more.'
)

root_dir = Path(__file__).parent

subprocess.call([
    'docker', 'run', '-d',
    '--name', 'songmaker-dev-db',
    '-p', '3306:3306',
    '-e', 'MYSQL_ROOT_PASSWORD=passwd',
    '-e', 'MYSQL_USER=songmaker',
    '-e', 'MYSQL_PASSWORD=passwd',
    '-e', 'MYSQL_DATABASE=songmaker',
    '-v', f'{root_dir.resolve()}:/docker-entrypoint-initdb.d',
    'mysql:8.0.23'
])
