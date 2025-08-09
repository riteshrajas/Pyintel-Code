#!/bin/bash

# Code Sync Deployment Script for Nginx
# This script builds the frontend and prepares the application for Nginx deployment

set -e  # Exit on any error

# Configuration
CLIENT_DIR="./client"
SERVER_DIR="./server"
BUILD_OUTPUT="./dist"
NGINX_ROOT="/var/www/html/client"  # Change this to your desired nginx root
SYSTEMD_SERVICE="code-sync-server"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Code Sync deployment...${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo -e "${YELLOW}📋 Checking dependencies...${NC}"
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists nginx; then
    echo -e "${RED}❌ Nginx is not installed. Please install Nginx first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All dependencies found${NC}"

# Build client
echo -e "${YELLOW}🏗️  Building client application...${NC}"
cd "$CLIENT_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing client dependencies...${NC}"
    npm ci
fi

# Build the application
echo -e "${YELLOW}🔨 Building client...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Client build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Client build completed${NC}"
cd ..

# Build server
echo -e "${YELLOW}🏗️  Building server application...${NC}"
cd "$SERVER_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing server dependencies...${NC}"
    npm ci
fi

# Build the server
echo -e "${YELLOW}🔨 Building server...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Server build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Server build completed${NC}"
cd ..

# Create deployment directories
echo -e "${YELLOW}📁 Preparing deployment directories...${NC}"
if [ ! -d "$BUILD_OUTPUT" ]; then
    mkdir -p "$BUILD_OUTPUT"
fi

# Copy built files
cp -r "$CLIENT_DIR/dist" "$BUILD_OUTPUT/client"
cp -r "$SERVER_DIR/dist" "$BUILD_OUTPUT/server"
cp -r "$SERVER_DIR/node_modules" "$BUILD_OUTPUT/server/"
cp "$SERVER_DIR/package.json" "$BUILD_OUTPUT/server/"

echo -e "${GREEN}✅ Build files prepared in $BUILD_OUTPUT${NC}"

# Instructions for manual deployment
echo -e "${YELLOW}📋 Manual deployment steps:${NC}"
echo -e "1. Copy client files to Nginx web root:"
echo -e "   ${GREEN}sudo cp -r $BUILD_OUTPUT/client/* $NGINX_ROOT/${NC}"
echo -e ""
echo -e "2. Copy Nginx configuration:"
echo -e "   ${GREEN}sudo cp nginx.conf /etc/nginx/sites-available/code-sync${NC}"
echo -e "   ${GREEN}sudo ln -sf /etc/nginx/sites-available/code-sync /etc/nginx/sites-enabled/${NC}"
echo -e ""
echo -e "3. Test Nginx configuration:"
echo -e "   ${GREEN}sudo nginx -t${NC}"
echo -e ""
echo -e "4. Reload Nginx:"
echo -e "   ${GREEN}sudo systemctl reload nginx${NC}"
echo -e ""
echo -e "5. Set up server as a systemd service (see systemd service file)"
echo -e ""
echo -e "6. Start the server service:"
echo -e "   ${GREEN}sudo systemctl start $SYSTEMD_SERVICE${NC}"
echo -e "   ${GREEN}sudo systemctl enable $SYSTEMD_SERVICE${NC}"

# Automatic deployment (requires sudo)
read -p "Do you want to attempt automatic deployment? (requires sudo) [y/N]: " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚀 Starting automatic deployment...${NC}"
    
    # Copy client files
    echo -e "${YELLOW}📁 Copying client files to $NGINX_ROOT...${NC}"
    sudo mkdir -p "$NGINX_ROOT"
    sudo cp -r "$BUILD_OUTPUT/client/"* "$NGINX_ROOT/"
    
    # Copy Nginx configuration
    echo -e "${YELLOW}⚙️  Setting up Nginx configuration...${NC}"
    sudo cp nginx.conf /etc/nginx/sites-available/code-sync
    sudo ln -sf /etc/nginx/sites-available/code-sync /etc/nginx/sites-enabled/
    
    # Remove default site if it exists
    if [ -f "/etc/nginx/sites-enabled/default" ]; then
        sudo rm /etc/nginx/sites-enabled/default
    fi
    
    # Test Nginx configuration
    echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
        
        # Reload Nginx
        echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
        sudo systemctl reload nginx
        
        echo -e "${GREEN}✅ Nginx reloaded successfully${NC}"
    else
        echo -e "${RED}❌ Nginx configuration test failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
    echo -e "   - Set up the systemd service for the server"
    echo -e "   - Configure your domain in nginx.conf"
    echo -e "   - Set up SSL certificates if needed"
    echo -e "   - Configure environment variables"
else
    echo -e "${YELLOW}ℹ️  Manual deployment instructions provided above${NC}"
fi

echo -e "${GREEN}🎉 Build process completed!${NC}"
