#!/bin/bash

# Generate timestamp version (e.g., 20260207143022)
VERSION=$(date +%Y%m%d%H%M%S)

echo "Updating version to: $VERSION"

# Update version in index.html for CSS and JS files
sed -i.bak "s/main\.css?v=[0-9]*/main.css?v=$VERSION/g" index.html
sed -i.bak "s/config\.js?v=[0-9]*/config.js?v=$VERSION/g" index.html
sed -i.bak "s/app\.js?v=[0-9]*/app.js?v=$VERSION/g" index.html
sed -i.bak "s/main\.js?v=[0-9]*/main.js?v=$VERSION/g" index.html

# Remove backup file
rm index.html.bak

echo "✓ Updated all version numbers to $VERSION"
echo "Files ready to commit!"
