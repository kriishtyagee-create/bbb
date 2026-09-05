import os, sys, socket

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
from app import create_app

def find_available_port(start_port=5000):
    for port in range(start_port, 6000):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('127.0.0.1', port))
                return port
        except OSError:
            continue
    return start_port

if __name__ == '__main__':
    port = int(os.getenv('PORT', find_available_port()))
    print("=" * 65)
    print("🌿 SIH 2024 (PS 26044): AYUSH Academia-Industry Collaboration Portal")
    print(f"🚀 Unified Portal is LIVE at: http://127.0.0.1:{port}")
    print(f"   - API Health: http://127.0.0.1:{port}/api/health")
    print("=" * 65)
    create_app().run(host='0.0.0.0', port=port, debug=True)

