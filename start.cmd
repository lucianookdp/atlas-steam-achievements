@echo off
title Atlas - Conquistas Steam
cd /d "%~dp0"
set "ATLAS_ENABLE_EXPERIMENTAL_WRITES="
if exist "%~dp0runtime\node.exe" (
  "%~dp0runtime\node.exe" server.js
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo Node.js 18 ou superior nao foi encontrado.
    echo Instale Node.js pelo site oficial: https://nodejs.org/
    echo Depois, abra este arquivo novamente.
    pause
    exit /b 1
  )
  node server.js
)
pause
