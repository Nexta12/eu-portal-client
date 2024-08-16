#!/bin/bash

# Remove node_modules
rm -rf node_modules

# Remove build artifacts
rm -rf build

# Remove package-lock.json (optional)
rm -f package-lock.json

# Remove yarn.lock (optional)
rm -f yarn.lock

# Clean up npm cache
npm cache clean --force
