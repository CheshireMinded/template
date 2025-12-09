#!/bin/bash

# Stop on errors
set -e

# Name of the virtual environment directory
VENV_DIR="venv"

echo "Updating package lists..."
sudo apt update -y

echo "Installing python3-venv..."
sudo apt install -y python3-venv

echo "Creating virtual environment in $VENV_DIR ..."
python3 -m venv "$VENV_DIR"

echo ""
echo "======================================================"
echo " Virtual environment created successfully!"
echo " Location: $(pwd)/$VENV_DIR"
echo ""
echo " To activate the environment, run:"
echo "   source $VENV_DIR/bin/activate"
echo ""
echo " To deactivate it, run:"
echo "   deactivate"
echo "======================================================"
echo ""

