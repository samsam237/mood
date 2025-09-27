@echo off
echo Installing all required dependencies for Mood Tracker App...
echo.

echo Installing core dependencies...
npm install expo-status-bar --legacy-peer-deps

echo Installing PDF dependencies...
npm install react-native-blob-util --legacy-peer-deps

echo Installing web dependencies...
npm install react-native-web@~0.19.6 @expo/metro-runtime@~3.1.3 --legacy-peer-deps

echo Installing chart dependencies...
npm install react-native-chart-kit react-native-svg --legacy-peer-deps

echo.
echo All dependencies installed successfully!
echo You can now run: npx expo start --web
pause
