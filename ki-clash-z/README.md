# Ki Clash Z - LAN + Android package

## LAN play (same Wi-Fi) - automatic
1. Install Node.js (v18+) on one laptop/PC.
2. In this folder run:  node server.js
3. Phones/tablets/PCs on the same Wi-Fi:
   - In a browser: open the address the server prints (e.g. http://192.168.1.5:3000). The game connects to that server automatically.
   - In the Android app: tap LAN play. The app finds the server by itself (the server broadcasts its address on the Wi-Fi). If nothing is found after ~10 s it falls back to asking for the address.
4. On the title screen press L (or tap the LAN line). First player in is Player 1; each player picks a team (1-3).
Two players per server. Some routers/guest Wi-Fi block device-to-device traffic ("client isolation") - turn that off if players cannot find each other.

## Android APK - NOT built or tested here
The APK itself is not included: I could not run an Android build in my environment. android/ is a plain WebView wrapper around index.html.
Option A: push this folder to a GitHub repo; Actions -> "Build APK" produces a debug APK artifact.
Option B: open android/ in Android Studio -> Build -> Build APK(s).
