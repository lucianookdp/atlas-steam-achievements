@echo off
title Atlas - Teste real pela interface
cd /d "%~dp0"
set "ATLAS_ENABLE_EXPERIMENTAL_WRITES=1"
echo Atlas: modo experimental habilitado nesta janela.
echo Abrir o programa nao consulta sua conta nem envia conquistas.
echo Acesse http://127.0.0.1:47621 se o navegador nao abrir.
echo Feche esta janela para encerrar o servidor.
echo.
if exist "%~dp0runtime\node.exe" (
  "%~dp0runtime\node.exe" server.js
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo Node.js 18 ou superior nao foi encontrado.
    echo Instale Node.js pelo site oficial: https://nodejs.org/
    pause
    exit /b 1
  )
  node server.js
)
pause
