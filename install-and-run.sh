#!/bin/bash

# Church Image Downloader - Quick Setup and Run Script
# This script installs dependencies and runs the image downloader

echo "=========================================================================="
echo "       CHURCH PRESENTATION IMAGE DOWNLOADER - QUICK SETUP"
echo "=========================================================================="
echo ""

# Navigate to script directory
cd "/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"
echo ""

# Initialize npm if needed
if [ ! -f "package.json" ]; then
    echo "Initializing npm project..."
    npm init -y
    echo ""
fi

# Check if Playwright is installed
if [ ! -d "node_modules/playwright" ]; then
    echo "Installing Playwright (this may take a few minutes)..."
    npm install playwright
    echo ""

    echo "Installing Chromium browser..."
    npx playwright install chromium
    echo ""
else
    echo "✓ Playwright already installed"
    echo ""
fi

# Create output directories
mkdir -p "12stone-church-presentation/images"
mkdir -p "screenshots"

echo "✓ All dependencies installed"
echo "✓ Output directories created"
echo ""
echo "=========================================================================="
echo "                    READY TO START!"
echo "=========================================================================="
echo ""
echo "The script will now launch the image downloader."
echo ""
echo "REMEMBER:"
echo "  1. The browser will open automatically"
echo "  2. Review each search result"
echo "  3. Download your favorite image with the suggested filename"
echo "  4. Move it to the images folder"
echo "  5. Press ENTER to continue to the next image"
echo ""
echo "Starting in 3 seconds..."
sleep 3

# Run the downloader script
node download-church-images.js
