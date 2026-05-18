@echo off
echo Starting Epicure AI Frontend...
cd /d "%~dp0\epicure-frontend"
cmd /c npm run dev
pause
