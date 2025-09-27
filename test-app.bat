@echo off
echo ========================================
echo TEST MOOD TRACKER APP
echo ========================================
echo.

echo 1. Verification des fichiers critiques...
if exist "App.js" (echo ✓ App.js) else (echo ✗ App.js manquant)
if exist "src\utils\platform.js" (echo ✓ platform.js) else (echo ✗ platform.js manquant)
if exist "src\screens\HomeScreen.web.js" (echo ✓ HomeScreen.web.js) else (echo ✗ HomeScreen.web.js manquant)
if exist "src\screens\MoodEntryScreen.web.js" (echo ✓ MoodEntryScreen.web.js) else (echo ✗ MoodEntryScreen.web.js manquant)
if exist "src\screens\AnalyticsScreen.web.js" (echo ✓ AnalyticsScreen.web.js) else (echo ✗ AnalyticsScreen.web.js manquant)
if exist "src\screens\ProfileScreen.web.js" (echo ✓ ProfileScreen.web.js) else (echo ✗ ProfileScreen.web.js manquant)
if exist "src\screens\AuthScreen.web.js" (echo ✓ AuthScreen.web.js) else (echo ✗ AuthScreen.web.js manquant)
if exist "src\screens\PDFViewerScreen.web.js" (echo ✓ PDFViewerScreen.web.js) else (echo ✗ PDFViewerScreen.web.js manquant)
echo.

echo 2. Verification des composants...
if exist "src\components\common\Button.js" (echo ✓ Button.js) else (echo ✗ Button.js manquant)
if exist "src\components\common\Card.js" (echo ✓ Card.js) else (echo ✗ Card.js manquant)
if exist "src\components\web\WebLinearGradient.js" (echo ✓ WebLinearGradient.js) else (echo ✗ WebLinearGradient.js manquant)
echo.

echo 3. Verification des contextes...
if exist "src\contexts\AuthContext.js" (echo ✓ AuthContext.js) else (echo ✗ AuthContext.js manquant)
if exist "src\contexts\MoodContext.js" (echo ✓ MoodContext.js) else (echo ✗ MoodContext.js manquant)
if exist "src\contexts\ThemeContext.js" (echo ✓ ThemeContext.js) else (echo ✗ ThemeContext.js manquant)
echo.

echo 4. Verification du theme...
if exist "src\constants\theme.js" (echo ✓ theme.js) else (echo ✗ theme.js manquant)
echo.

echo 5. Demarrage de l'application...
echo.
echo URLs a tester:
echo - http://localhost:19006
echo - http://localhost:8081
echo.
echo Appuyez sur Ctrl+C pour arreter l'application
echo.

call npx expo start --web --clear

pause
