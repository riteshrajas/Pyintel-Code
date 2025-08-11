# 🌐 HTML Live Preview Feature

## Overview

The HTML Live Preview feature allows you to see your HTML code rendered in real-time as you type. This is perfect for collaborative web development where multiple users can see changes instantly.

## Features

✨ **Real-time Updates**: See changes as you type with smart debouncing
🤝 **Collaborative**: All users in the room see preview updates in real-time
🎨 **Auto-wrapping**: Incomplete HTML is automatically wrapped in a complete document
🔒 **Secure**: Uses sandboxed iframes for safe rendering
📱 **Responsive**: Works with responsive designs and mobile viewports
🎯 **Smart Detection**: Automatically detects HTML files (.html, .htm)

## How to Use

### 1. Open an HTML File
- Create a new file with `.html` or `.htm` extension
- Or upload an existing HTML file

### 2. Enable Live Preview
- Look for the "Live Preview" button in the editor header (only appears for HTML files)
- Click the button to toggle the preview panel on/off
- The preview appears in a split-screen view alongside your code

### 3. Start Coding
- Type your HTML code in the editor
- See changes reflected in the preview panel automatically
- Other users in the room will see your preview updates in real-time

### 4. Preview Features
- **Auto-refresh**: Preview updates automatically as you type (1-second debounce)
- **Manual refresh**: Click the refresh button for immediate updates
- **Error handling**: Shows helpful error messages if HTML is invalid
- **Responsive**: Preview adapts to the panel size

## Example Usage

1. Create a new file called `index.html`
2. Start with a simple structure:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Live Preview</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This updates in real-time!</p>
</body>
</html>
```

3. Click "Live Preview" to see it rendered
4. Make changes and watch them appear instantly!

## Technical Details

### Auto-wrapping
If you write HTML without a complete document structure, the preview will automatically wrap it:

**Your code:**
```html
<h1>Hello</h1>
<p>World</p>
```

**Auto-wrapped:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview - yourfile.html</title>
</head>
<body>
    <h1>Hello</h1>
    <p>World</p>
</body>
</html>
```

### Real-time Collaboration
- When you make changes, other users see your preview update automatically
- Uses WebSocket events for instant synchronization
- Preview state is maintained across user sessions

### Security
- Previews run in sandboxed iframes
- Safe execution of JavaScript in preview
- Isolated from the main application

## Keyboard Shortcuts

- **Toggle Preview**: No default shortcut (use the button)
- **Refresh Preview**: Click the refresh button in preview header

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid/Flexbox
- WebSockets
- iframe sandboxing

## Tips for Best Experience

1. **Use proper HTML structure** for best results
2. **Include responsive meta tags** for mobile testing
3. **Use relative paths** for assets (CSS, images, etc.)
4. **Test with different screen sizes** using browser dev tools
5. **Collaborate in real-time** with team members

## Troubleshooting

### Preview not showing
- Ensure file has `.html` or `.htm` extension
- Check that the "Live Preview" button is visible and clickable

### Preview not updating
- Click the manual refresh button
- Check browser console for JavaScript errors
- Ensure HTML syntax is valid

### Collaborative preview not working
- Check WebSocket connection status
- Ensure all users are in the same room
- Refresh the page if connection issues persist

## Future Enhancements

🔮 Planned features:
- CSS file preview support
- Mobile device simulation
- Console output display
- Performance metrics
- Screenshot capture
- Multi-device testing

---

**Note**: This feature works best with modern HTML5 and CSS3. For optimal collaboration, ensure all team members have stable internet connections.
