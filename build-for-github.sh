#!/bin/bash

# Simple build script for GitHub Pages - everything at root
set -e

echo "🚀 Building for GitHub Pages..."
echo ""

# Build the project
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist folder not found"
    exit 1
fi

echo "✅ Build complete!"
echo ""

# Clean root (keep source files)
echo "🧹 Cleaning root directory..."
rm -rf assets/ *.html *.css *.js favicon.ico robots.txt placeholder.svg INNLUXE/ 2>/dev/null || true

# Move everything from dist to root
echo "📋 Moving built files to root..."
cp -r dist/* .

# Clean dist folder
rm -rf dist/

# Ensure .nojekyll exists
touch .nojekyll

echo ""
echo "✅ Build complete! Files ready at root."
echo ""
echo "📦 Structure:"
ls -1 | grep -E '\.(html|ico|svg|txt)$|^assets$' | head -10
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Deploy to GitHub Pages'"
echo "3. git push origin main"
echo ""
echo "Configure GitHub Pages: Branch main, Folder: / (root)"
echo ""

