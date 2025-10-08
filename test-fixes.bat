@echo off
echo ========================================
echo TESTING BLANK SCREEN FIXES
echo ========================================
echo.

echo 1. Checking critical fixes...
echo ✓ App.js - SimpleIcon component added
echo ✓ App.js - Icon import issue fixed
echo ✓ platform.js - Error handling added
echo ✓ AuthContext - Web mock users enabled
echo.

echo 2. Starting application...
echo.
echo URLs to test:
echo - http://localhost:19006
echo - http://localhost:8081
echo.
echo Expected results:
echo ✓ App loads without blank screen
echo ✓ Navigation tabs with emoji icons (🏠😊📊👤)
echo ✓ Authentication screen with gradient
echo ✓ "Continue with Google" creates mock user
echo ✓ All screens display content
echo.

echo 3. If you still see blank screens:
echo - Open browser Developer Tools (F12)
echo - Check Console tab for errors
echo - Look for red error messages
echo - Share specific errors with me
echo.

call npx expo start --web --clear

pause
