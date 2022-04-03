from pathlib import Path
import subprocess

print("rebuilding frontend for integration tests")
frontend_dir = Path(Path(__file__).parents[1], "frontend")
subprocess.call(["npm", "run", "build"], cwd=frontend_dir)
