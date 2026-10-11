@echo off
title Atlas - Conquistas Steam
cd /d "%~dp0"
set "ATLAS_ENABLE_EXPERIMENTAL_WRITES=1"
echo ATLAS - Conquistas Steam
echo.
echo A interface vai abrir no navegador.
echo Se nao abrir, acesse: http://127.0.0.1:47621
echo O envio so acontece depois que voce escolher e confirmar as conquistas.
echo Para encerrar, feche esta janela.
echo.
if exist "%~dp0runtime\node.exe" (
  "%~dp0runtime\node.exe" server.js
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo Node.js 18 ou superior nao foi encontrado.
    echo Instale em https://nodejs.org/ e abra este arquivo novamente.
    pause
    exit /b 1
  )
  node server.js
)
pause
