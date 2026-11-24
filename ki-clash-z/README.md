# Ki Clash Z - online/LAN play with a room code (no server of your own)

## Play with a friend
1. Both devices need internet. Open index.html in a browser (or install the Android app).
2. Title screen: press L (or tap the "ONLINE / LAN PLAY" line).
3. One player taps HOST A GAME and reads out the 4-letter room code. The other types it and taps JOIN WITH CODE.
4. Each player picks a team (1-3). The match starts when both have chosen.
How it works: the game uses PeerJS (WebRTC). The two devices find each other through PeerJS's free public broker (0.peerjs.com), then play directly device-to-device. The PeerJS library is loaded from the jsDelivr CDN when you open the online menu, so the rest of the game still works offline.
Limits: strict firewalls / some mobile carriers (no TURN relay is configured) can block the direct connection. If the broker or CDN is down, online play will not connect.

## PC / Mac / Linux
Easiest (no install, no build): double-click the launcher for your system - Play-Windows.bat, Play-Mac.command (right-click > Open the first time) or Play-Linux.sh. It opens the game in its own app-style window using Chrome or Edge, with keyboard, gamepad and online play. Press F11 for full screen.
Real installable app (Electron): the desktop/ folder is an Electron project. Push this folder to GitHub and run the "Build desktop apps" workflow to get a Windows installer + portable .exe, a Mac .dmg and a Linux AppImage. Or on your PC with Node.js: cd desktop, npm install, npm start (run the game) / npm run dist (build the installer). I could not run these builds here, so they are untested.

## Android APK - NOT built or tested here
The APK itself is not included: I could not run an Android build in my environment. android/ is a plain WebView wrapper around index.html.
Option A: push this folder to a GitHub repo; Actions -> "Build APK" produces a debug APK artifact.
Option B: open android/ in Android Studio -> Build -> Build APK(s).
