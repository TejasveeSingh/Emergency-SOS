# Emergency-SOS — SafeHer Web-Based Safety Companion

SafeHer is a modern, responsive women's safety web application designed with an empathetic pink-and-white visual palette, featuring a dedicated **Emergency Assistance / SOS** response system.

## Project Structure
- `index.html`: SafeHer Home Page (matching the design visual reference) and dedicated SOS flows (Confirmation, Real-Time Location Loading, Error Recovery, and Laptop-Friendly SOS Active Dashboard).
- `styles.css`: Complete responsive design system with SafeHer blush and crimson aesthetic, glowing beacon animations, and optimized two-column 1366x768 laptop layout.
- `app.js`: Pure ES6 application engine handling browser native Geolocation API, dynamic Google Maps URL generation, Clipboard API copying with fallback, modal disclaimers, and state resets.
- `server.ps1`: Zero-dependency local development HTTP server built with PowerShell `.NET HttpListener` (serves on `http://localhost:3000`).
- `run_safeher.bat`: One-click batch launcher to boot the server and open Google Chrome directly.

## How to Run

### Quick Launch (Double Click)
Double-click `run_safeher.bat` in this folder. It starts the local server on port 3000 and automatically opens Google Chrome at `http://localhost:3000`.

### Manual PowerShell Launch
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1 -Port 3000
```
Then navigate to `http://localhost:3000` in Google Chrome.

> **Note on Geolocation in Browsers**: Modern web browsers (including Google Chrome) require a Secure Origin (`http://localhost` or `https://`) to allow `navigator.geolocation` and `navigator.clipboard`. Running SafeHer via `http://localhost:3000` enables full native access to your device's actual GPS / location coordinates.

## User Flow
1. **Home Page**: Displays SafeHer branding, "Your Safety, Our Priority", "Hello, User", avatar, large "Emergency SOS" button, 4 quick feature cards, and bottom navigation.
2. **Click "Emergency SOS"**: Opens the dedicated SOS Confirmation Screen (`← Emergency SOS`, glowing beacon, "Are you sure you want to activate emergency assistance?", `CANCEL` and `ACTIVATE SOS`).
3. **Click "ACTIVATE SOS"**: Shows "Detecting your location..." with radar pulse animation, queries `navigator.geolocation.getCurrentPosition()`.
4. **SOS Active Screen**:
   - Status header: `🚨 SOS ACTIVE`
   - Three verified status badges (Location detected, Emergency alert prepared, Trusted contact message ready).
   - Left Column: Current Location card with actual Latitude, Longitude, Accuracy, and `VIEW ON MAP` button (opens Google Maps in a new tab).
   - Right Column: Dynamic Emergency Message with `COPY MESSAGE` button (copies to clipboard, shows toast notification).
   - Action buttons:
     - `CALL EMERGENCY — 112`: Displays laptop prototype disclaimer modal ("On a mobile device, this action would open the emergency calling interface for 112.").
     - `I'M SAFE NOW`: Resets emergency state, clears temporary location data, and returns safely to the Home Page.
