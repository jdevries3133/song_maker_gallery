import re
import sys


if len(sys.argv) == 2:
    new = sys.argv[1]
else:
    new = input('Enter new version number: ')


def change(path, regex, replacement):
    with open(path, 'r') as fl:
        data = fl.read()
    with open(path, 'w') as fl:
        fl.write(re.sub(regex, replacement, data))


# update index.html template
change(
    'frontend/templates/frontend/index.html',
    r'webpack_output/main_v(.*)\.js',
    f'webpack_output/main_v{new}.js',
)

# update package.json
change(
    'frontend/package.json',
    r'"version": "(.*)",',
    f'"version": "{new}",'
)

# update webpack config
change(
    'frontend/webpack.config.js',
    r'filename: "main_v(.*).js",',
    f'filename: "main_v{new}.js",',
)
