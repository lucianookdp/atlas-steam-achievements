@echo off
title Atlas - Somente leitura
cd /d "%~dp0"
if not exist "%~dp0server.js" (
  echo ERRO: server.js nao esta junto deste arquivo.
  echo Abra "Somente leitura.cmd" dentro da pasta steam-achievements.
  echo Se quiser usar pela Area de Trabalho, crie um ATALHO para ele; nao copie so o CMD.
  pause
  exit /b 1
)
set "ATLAS_ENABLE_EXPERIMENTAL_WRITES="
echo ATLAS - Somente leitura
echo.
echo A interface vai abrir no navegador sem opcao de envio.
echo Se nao abrir, acesse: http://127.0.0.1:47621
echo Para encerrar, feche esta janela.
echo.
if exist "%~dp0runtime\node.exe" (
  "%~dp0runtime\node.exe" "%~dp0server.js"
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo Node.js 18 ou superior nao foi encontrado.
    echo Instale Node.js pelo site oficial: https://nodejs.org/
    echo Depois, abra este arquivo novamente.
    pause
    exit /b 1
  )
  node "%~dp0server.js"
)
pause
