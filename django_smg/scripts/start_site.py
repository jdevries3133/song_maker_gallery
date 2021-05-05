"""
This run webpack in development (watch) mode and the django development server
in two separate subprocesse at the same time.
"""
from pathlib import Path

from utilities import Runner

frontend_dir = Path(Path(__file__).parents[1], 'frontend').resolve()
managepy_path = Path(Path(__file__).parents[1], 'manage.py').resolve()

runner_cmd = (
    f'npm run dev --prefix {frontend_dir} -- --watch,'
    f'{managepy_path} runserver 0.0.0.0:8000'
)

Runner(runner_cmd).start()
