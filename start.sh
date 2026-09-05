#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "================================================================="
echo "🌿 Starting SIH 2024 PS 26044: AYUSH Academia-Industry Portal"
echo "================================================================="

# Activate virtual environment if available
if [ -d "backend/venv" ]; then
    source backend/venv/bin/activate
fi

# Detect Python command (python3 or python)
if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Error: Python 3 is not installed or not in PATH."
    exit 1
fi

# Run backend test suite to ensure system health
echo "Running system health verification..."
$PYTHON_CMD backend/test_api.py

echo ""
echo "🚀 Launching unified portal server..."
$PYTHON_CMD run.py

