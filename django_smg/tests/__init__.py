from pathlib import Path
import subprocess

print("rebuilding frontend for integration tests")
frontend_dir = Path(Path(__file__).parents[1], "frontend")
subprocess.call(["yarn", "dev"], cwd=frontend_dir)
