# 🚀 Nginx Deployment Guide for Code Sync

## Prerequisites
- Ubuntu/Debian server with sudo access
- Node.js 18+ installed
- Nginx installed
- PM2 (recommended) or systemd for process management

## Step-by-Step Deployment

### 1. 📦 Build Your Application

First, build both client and server:

```bash
# Build client
cd client
npm install
npm run build

# Build server  
cd ../server
npm install
npm run build
```

### 2. 🗂️ Prepare Server Files

Create deployment directory and copy files:

```bash
# Create application directory
sudo mkdir -p /opt/code-sync/server
sudo mkdir -p /var/www/html/client

# Copy server files
sudo cp -r server/dist/* /opt/code-sync/server/
sudo cp -r server/node_modules /opt/code-sync/server/
sudo cp server/package.json /opt/code-sync/server/

# Copy client files to nginx web root
sudo cp -r client/dist/* /var/www/html/client/

# Set correct ownership
sudo chown -R www-data:www-data /opt/code-sync
sudo chown -R www-data:www-data /var/www/html/client
```

### 3. ⚙️ Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/code-sync

# Enable the site
sudo ln -sf /etc/nginx/sites-available/code-sync /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx if test passes
sudo systemctl reload nginx
```

### 4. 🔧 Set Up Environment Variables

Create environment file for your server:

```bash
sudo nano /opt/code-sync/server/.env
```

Add your environment variables:
```env
NODE_ENV=production
PORT=4321
# Add other variables as needed
```

### 5. 🚀 Start the Server

**Option A: Using systemd (recommended for production)**

```bash
# Copy systemd service file
sudo cp code-sync-server.service /etc/systemd/system/

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl start code-sync-server
sudo systemctl enable code-sync-server

# Check status
sudo systemctl status code-sync-server
```

**Option B: Using PM2 (alternative)**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
cd /opt/code-sync/server
sudo -u www-data pm2 start dist/server.js --name "code-sync-server"

# Save PM2 configuration
sudo -u www-data pm2 save
sudo -u www-data pm2 startup
```

### 6. 🌐 Configure Your Domain

Edit the nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/code-sync
```

Replace `your-domain.com` with your actual domain name.

### 7. 🔒 Optional: Set Up SSL with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔍 Verification

1. **Check if server is running:**
   ```bash
   curl http://localhost:4321/health
   ```

2. **Check nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Check application logs:**
   ```bash
   # For systemd
   sudo journalctl -u code-sync-server -f
   
   # For PM2
   sudo -u www-data pm2 logs code-sync-server
   ```

4. **Test the application:**
   - Open your browser and go to your domain
   - Check browser console for any errors
   - Test real-time features

## 🛠️ Troubleshooting

- **502 Bad Gateway:** Server not running on port 4321
- **404 Not Found:** Check nginx configuration and file paths
- **WebSocket connection failed:** Check proxy settings for `/socket.io/`
- **Static files not loading:** Check file permissions and nginx root path

## 🔄 Updates

When you need to update:

1. Build new version locally
2. Stop the server: `sudo systemctl stop code-sync-server`
3. Replace files in `/opt/code-sync/server/` and `/var/www/html/client/`
4. Start the server: `sudo systemctl start code-sync-server`

## 📝 Important Notes

- Your server runs on port **4321** (as configured)
- Client files are served from `/var/www/html/client`
- Server files are in `/opt/code-sync/server`
- All processes run as `www-data` user for security
