# Code Sync - Windows Deployment Script
# This script helps you build and prepare files for deployment to a Linux server with Nginx

param(
    [switch]$Build = $false,
    [switch]$Package = $false,
    [switch]$All = $false
)

# Colors for output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"

function Write-ColorOutput($ForegroundColor, $Message) {
    Write-Host $Message -ForegroundColor $ForegroundColor
}

function Test-Command($Command) {
    try {
        Get-Command $Command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

Write-ColorOutput $Green "🚀 Code Sync Deployment Helper (Windows)"
Write-ColorOutput $Yellow "This script will build your application for Nginx deployment"

# Check prerequisites
Write-ColorOutput $Yellow "📋 Checking prerequisites..."

if (-not (Test-Command "node")) {
    Write-ColorOutput $Red "❌ Node.js is not installed or not in PATH"
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-ColorOutput $Red "❌ npm is not installed or not in PATH"
    exit 1
}

Write-ColorOutput $Green "✅ Node.js and npm found"

# Build client if requested
if ($Build -or $All) {
    Write-ColorOutput $Yellow "🏗️ Building client application..."
    
    Push-Location "client"
    
    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput $Yellow "📦 Installing client dependencies..."
        npm ci
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput $Red "❌ Failed to install client dependencies"
            Pop-Location
            exit 1
        }
    }
    
    Write-ColorOutput $Yellow "🔨 Building client..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $Red "❌ Client build failed"
        Pop-Location
        exit 1
    }
    
    if (-not (Test-Path "dist")) {
        Write-ColorOutput $Red "❌ Client build failed - dist directory not found"
        Pop-Location
        exit 1
    }
    
    Write-ColorOutput $Green "✅ Client build completed"
    Pop-Location
    
    # Build server
    Write-ColorOutput $Yellow "🏗️ Building server application..."
    
    Push-Location "server"
    
    if (-not (Test-Path "node_modules")) {
        Write-ColorOutput $Yellow "📦 Installing server dependencies..."
        npm ci
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput $Red "❌ Failed to install server dependencies"
            Pop-Location
            exit 1
        }
    }
    
    Write-ColorOutput $Yellow "🔨 Building server..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $Red "❌ Server build failed"
        Pop-Location
        exit 1
    }
    
    if (-not (Test-Path "dist")) {
        Write-ColorOutput $Red "❌ Server build failed - dist directory not found"
        Pop-Location
        exit 1
    }
    
    Write-ColorOutput $Green "✅ Server build completed"
    Pop-Location
}

# Package for deployment if requested
if ($Package -or $All) {
    Write-ColorOutput $Yellow "📦 Packaging for deployment..."
    
    # Create deployment directory
    $DeployDir = "deploy-package"
    if (Test-Path $DeployDir) {
        Remove-Item $DeployDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $DeployDir | Out-Null
    New-Item -ItemType Directory -Path "$DeployDir\client" | Out-Null
    New-Item -ItemType Directory -Path "$DeployDir\server" | Out-Null
    New-Item -ItemType Directory -Path "$DeployDir\config" | Out-Null
    
    # Copy client build
    if (Test-Path "client\dist") {
        Copy-Item "client\dist\*" "$DeployDir\client\" -Recurse
        Write-ColorOutput $Green "✅ Client files packaged"
    } else {
        Write-ColorOutput $Red "❌ Client build not found. Run with -Build first"
        exit 1
    }
    
    # Copy server build and dependencies
    if (Test-Path "server\dist") {
        Copy-Item "server\dist\*" "$DeployDir\server\" -Recurse
        Copy-Item "server\node_modules" "$DeployDir\server\" -Recurse
        Copy-Item "server\package.json" "$DeployDir\server\"
        Write-ColorOutput $Green "✅ Server files packaged"
    } else {
        Write-ColorOutput $Red "❌ Server build not found. Run with -Build first"
        exit 1
    }
    
    # Copy configuration files
    Copy-Item "nginx.conf" "$DeployDir\config\"
    Copy-Item "code-sync-server.service" "$DeployDir\config\"
    Copy-Item "NGINX_DEPLOYMENT.md" "$DeployDir\"
    
    # Create deployment script for Linux server
    $LinuxDeployScript = @"
#!/bin/bash
# Code Sync Linux Deployment Script
# Run this script on your Linux server

set -e

echo "🚀 Deploying Code Sync to Nginx..."

# Create directories
sudo mkdir -p /opt/code-sync/server
sudo mkdir -p /var/www/html/client

# Copy files
echo "📁 Copying client files..."
sudo cp -r client/* /var/www/html/client/

echo "📁 Copying server files..."
sudo cp -r server/* /opt/code-sync/server/

# Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data /opt/code-sync
sudo chown -R www-data:www-data /var/www/html/client

# Configure Nginx
echo "⚙️ Configuring Nginx..."
sudo cp config/nginx.conf /etc/nginx/sites-available/code-sync
sudo ln -sf /etc/nginx/sites-available/code-sync /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Install systemd service
echo "🚀 Installing systemd service..."
sudo cp config/code-sync-server.service /etc/systemd/system/
sudo systemctl daemon-reload

# Create environment file
echo "📝 Creating environment file..."
sudo tee /opt/code-sync/server/.env > /dev/null << EOF
NODE_ENV=production
PORT=4321
EOF

echo "✅ Deployment files ready!"
echo ""
echo "To complete deployment:"
echo "1. Edit /etc/nginx/sites-available/code-sync - replace 'your-domain.com' with your domain"
echo "2. sudo systemctl reload nginx"
echo "3. sudo systemctl start code-sync-server"
echo "4. sudo systemctl enable code-sync-server"
echo ""
echo "Check status with: sudo systemctl status code-sync-server"
"@
    
    $LinuxDeployScript | Out-File -FilePath "$DeployDir\deploy-on-server.sh" -Encoding UTF8
    
    Write-ColorOutput $Green "✅ Deployment package created in '$DeployDir'"
    Write-ColorOutput $Yellow "📋 Next steps:"
    Write-ColorOutput $Yellow "   1. Transfer the '$DeployDir' folder to your Linux server"
    Write-ColorOutput $Yellow "   2. On the server, run: chmod +x deploy-on-server.sh && ./deploy-on-server.sh"
    Write-ColorOutput $Yellow "   3. Follow the instructions in NGINX_DEPLOYMENT.md"
}

if (-not $Build -and -not $Package -and -not $All) {
    Write-ColorOutput $Yellow "Usage:"
    Write-ColorOutput $Yellow "  .\deploy-windows.ps1 -Build     # Build client and server"
    Write-ColorOutput $Yellow "  .\deploy-windows.ps1 -Package   # Package for deployment"
    Write-ColorOutput $Yellow "  .\deploy-windows.ps1 -All       # Build and package"
    Write-ColorOutput $Yellow ""
    Write-ColorOutput $Yellow "Example: .\deploy-windows.ps1 -All"
}

Write-ColorOutput $Green "🎉 Script completed!"
