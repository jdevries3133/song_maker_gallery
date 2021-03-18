import re

new = input('Enter new version number: ')

def change(path, regex, replacement):
    with open(path, 'r') as fl:
        data = fl.read()
    with open(path, 'w') as fl:
        fl.write(re.sub(regex, replacement, data))

# update VERSION tracker file at root
with open( 'VERSION', 'w') as fl:
    fl.write(new)

# update index.html template
change(
    'django_smg/frontend/templates/frontend/index.html',
    r'webpack_output/main_v(.*)\.js',
    f'webpack_output/main_v{new}.js',
)

# update package.json
change(
    'django_smg/frontend/package.json',
    r'"version": "(.*)",',
    f'"version": "{new}",'
)

# update webpack config
change(
    'django_smg/frontend/webpack.config.js',
    r'filename: "main_v(.*).js",',
    f'filename: "main_v{new}.js",',
)
