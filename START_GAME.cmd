@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
) else (
  set "NODE_EXE=node"
)
if not exist "%NODE_EXE%" if "%NODE_EXE%"=="node" goto dependencies
if not exist "%NODE_EXE%" (
  echo Chua tim thay Node.js 24+. Hay cai Node.js truoc khi choi.
  pause
  exit /b 1
)
:dependencies
if not exist "node_modules\ws" (
  echo Chua co thu vien. Cai Node.js 24+, chay npm install trong thu muc game.
  pause
  exit /b 1
)
echo Mo trinh duyet tai http://127.0.0.1:3000
echo Nhan Ctrl+C de dung may chu.
"%NODE_EXE%" server\main.mjs
if errorlevel 1 pause
