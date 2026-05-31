@echo off
:: Check if node_modules folder exists. If not, run npm install automatically.
if not exist "node_modules\" (
    echo [!] Dependencies missing. Running npm install...
    call npm install
    echo [OK] Dependencies installed successfully.
    echo.
)

node setup.js
pause