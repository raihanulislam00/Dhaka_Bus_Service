# 📸 Complete Screenshot Guide for Dhaka Bus Service

## Quick Start Checklist

### ✅ Prerequisites 
- [ ] Backend server running on http://localhost:3000
- [ ] Frontend server running on http://localhost:8000  
- [ ] Database seeded with sample data
- [ ] Browser ready (Chrome/Firefox recommended)

### ✅ Screenshot Setup
- [ ] Browser window set to 1920x1080 resolution
- [ ] Developer tools closed (for clean screenshots)
- [ ] Screenshot tool ready (built-in or extension)

## 📋 Complete Screenshot List

### 🏠 Main Pages (3 screenshots)
| Filename | Page URL | Description |
|----------|----------|-------------|
| `homepage.png` | http://localhost:8000 | Main landing page with navigation |
| `about-page.png` | http://localhost:8000/about | Company information and details |
| `contact-page.png` | http://localhost:8000/contact | Contact form and information |

### 👥 Passenger Portal (4 screenshots)
| Filename | Page URL | Description |
|----------|----------|-------------|
| `passenger-register.png` | http://localhost:8000/passenger/register | Passenger registration form |
| `passenger-login.png` | http://localhost:8000/passenger/login | Passenger authentication |
| `passenger-dashboard.png` | http://localhost:8000/passenger/dashboard | Passenger main dashboard |
| `ticket-booking.png` | http://localhost:8000/passenger/book-ticket | Ticket booking interface |

### 🚗 Driver Portal (6 screenshots)
| Filename | Page URL | Description |
|----------|----------|-------------|
| `driver-register.png` | http://localhost:8000/driver/register | Driver registration with documents |
| `driver-login.png` | http://localhost:8000/driver/login | Driver authentication |
| `driver-dashboard.png` | http://localhost:8000/driver/dashboard | Driver main dashboard |
| `driver-routes.png` | http://localhost:8000/driver/routes | Assigned routes view |
| `driver-schedules.png` | http://localhost:8000/driver/schedules | Driver schedule management |
| `driver-trips.png` | http://localhost:8000/driver/trips | Trip management and status |

### 👨‍💼 Admin Portal (6 screenshots)  
| Filename | Page URL | Description |
|----------|----------|-------------|
| `admin-login.png` | http://localhost:8000/admin/login | Admin authentication |
| `admin-dashboard.png` | http://localhost:8000/admin/dashboard | Admin control panel |
| `admin-manage-drivers.png` | http://localhost:8000/admin/manage-drivers | Driver management interface |
| `admin-manage-passengers.png` | http://localhost:8000/admin/manage-passengers | Passenger management |
| `admin-routes.png` | http://localhost:8000/admin/routes | Route creation and management |
| `admin-schedules.png` | http://localhost:8000/admin/schedules | Schedule configuration |

### 🗺️ Interactive Features (1 screenshot)
| Filename | Page URL | Description |
|----------|----------|-------------|
| `bus-tracking-demo.png` | http://localhost:8000/demo/map | Real-time bus tracking map |

## 🎯 Screenshot Standards

### Quality Guidelines
- **Resolution**: 1920x1080 minimum
- **Format**: PNG (for clarity)
- **Compression**: Minimal (maintain quality)
- **Browser**: Chrome or Firefox (consistent rendering)

### Content Guidelines
- **Data**: Use realistic sample data
- **UI State**: Show populated forms and data
- **Navigation**: Highlight current page/section
- **Responsive**: Take both desktop and mobile versions

### Technical Guidelines
- **No DevTools**: Close browser developer tools
- **Clean URL**: Remove unnecessary parameters
- **Full Page**: Capture complete page content
- **Consistent**: Use same browser and settings

## 🛠️ Recommended Tools

### macOS
```bash
# Built-in screenshot (Cmd+Shift+5)
# Choose "Capture Selected Portion" or "Capture Entire Screen"
```

### Windows
```bash
# Built-in Snipping Tool (Win+Shift+S)  
# Or use Snip & Sketch app
```

### Browser Extensions
- **Chrome**: "Full Page Screen Capture" 
- **Firefox**: "Nimbus Screenshot"

### Command Line Tools
```bash
# macOS - screencapture
screencapture -x -o screenshot.png

# Linux - scrot
scrot -s screenshot.png
```

## 🚀 Automation Script Usage

Run the helper script to get all URLs:
```bash
./screenshot-helper.sh
```

This will:
- ✅ Check if servers are running
- 📋 List all URLs to screenshot
- 💡 Provide troubleshooting tips

## 📱 Mobile Screenshots (Optional)

### Responsive Testing
1. Open browser DevTools (F12)
2. Click device toggle button
3. Select device: iPhone 12 Pro (390x844)
4. Take mobile screenshots with `-mobile` suffix

### Mobile Screenshot List
- `homepage-mobile.png`
- `passenger-dashboard-mobile.png` 
- `driver-dashboard-mobile.png`
- `admin-dashboard-mobile.png`

## 🔧 Troubleshooting

### Common Issues

**Pages Not Loading:**
```bash
# Check servers are running
curl http://localhost:3000  # Backend
curl http://localhost:8000  # Frontend
```

**Database Empty:**
```bash
cd backend
npm run seed:routes
```

**Authentication Issues:**
- Clear browser localStorage
- Use incognito/private mode
- Check browser console for errors

**Styling Issues:**
- Clear browser cache
- Disable browser extensions
- Use default browser zoom (100%)

### Test Pages First
Before taking screenshots, manually test:
1. ✅ All pages load without errors
2. ✅ Navigation works properly  
3. ✅ Forms can be filled out
4. ✅ Data displays correctly
5. ✅ Responsive design works

## 📊 Progress Tracking

Create a checklist to track screenshot completion:

```markdown
### Main Pages
- [ ] homepage.png
- [ ] about-page.png  
- [ ] contact-page.png

### Passenger Portal
- [ ] passenger-register.png
- [ ] passenger-login.png
- [ ] passenger-dashboard.png
- [ ] ticket-booking.png

### Driver Portal  
- [ ] driver-register.png
- [ ] driver-login.png
- [ ] driver-dashboard.png
- [ ] driver-routes.png
- [ ] driver-schedules.png
- [ ] driver-trips.png

### Admin Portal
- [ ] admin-login.png
- [ ] admin-dashboard.png
- [ ] admin-manage-drivers.png
- [ ] admin-manage-passengers.png
- [ ] admin-routes.png
- [ ] admin-schedules.png

### Interactive Features
- [ ] bus-tracking-demo.png
```

## 🎉 Final Steps

1. **Review all screenshots** for quality and completeness
2. **Optimize file sizes** if needed (keep under 2MB each)
3. **Update README.md** image links if needed  
4. **Commit screenshots** to version control
5. **Test README.md** rendering with screenshots

---

**Happy Screenshot Taking! 📸**