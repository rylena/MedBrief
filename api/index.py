import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from app import app
except Exception as e:
    print(f"Error importing app: {e}")
    import traceback
    traceback.print_exc()
    raise

app = app
