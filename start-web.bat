@echo off
echo Starting Mood Tracker Web Application...
echo.

echo Installing missing dependencies...
call npm install expo-linear-gradient --legacy-peer-deps
call npm install react-native-vector-icons --legacy-peer-deps

echo.
echo Starting Expo web server...
call npx expo start --web --clear

pause
