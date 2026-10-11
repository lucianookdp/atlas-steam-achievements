const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');

function selectedInstallDir(appid, libraryPaths) {
  for (const library of libraryPaths()) {
    try {
      const manifest = fs.readFileSync(path.join(library, 'steamapps', `appmanifest_${appid}.acf`), 'utf8');
      const match = manifest.match(/"installdir"\s+"([^"\r\n]+)"/i);
      if (match && !/[\\/]/.test(match[1]) && match[1] !== '.' && match[1] !== '..') return match[1].toLowerCase();
    } catch { /* Try another Steam library. */ }
  }
  throw new Error('Não foi possível confirmar a instalação do jogo selecionado. Nenhum envio foi feito.');
}

function gameFolder(executablePath) {
  const match = String(executablePath || '').match(/[\\/]steamapps[\\/]common[\\/]([^\\/]+)[\\/]/i);
  return match ? match[1].toLowerCase() : null;
}

function windowsSteamProcesses() {
  const script = '$ErrorActionPreference="Stop"; $paths=@(Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -like "*\\steamapps\\common\\*" } | Select-Object -ExpandProperty ExecutablePath); ConvertTo-Json -InputObject $paths -Compress';
  return new Promise((resolve, reject) => {
    execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { windowsHide: true, timeout: 10000, maxBuffer: 256_000 }, (error, stdout) => {
      if (error) return reject(new Error('Não foi possível verificar os jogos em execução. Nenhum envio foi feito.'));
      try {
        const result = JSON.parse(stdout.trim());
        resolve(Array.isArray(result) ? result : result ? [result] : []);
      } catch { reject(new Error('Não foi possível verificar os jogos em execução. Nenhum envio foi feito.')); }
    });
  });
}

async function assertNoOtherSteamGame(appid, libraryPaths, listProcesses = windowsSteamProcesses) {
  if (process.platform !== 'win32' && listProcesses === windowsSteamProcesses) throw new Error('A verificação de jogos em execução está disponível apenas no Windows. Nenhum envio foi feito.');
  const selected = selectedInstallDir(appid, libraryPaths);
  const paths = await listProcesses();
  if (!Array.isArray(paths)) throw new Error('Não foi possível verificar os jogos em execução. Nenhum envio foi feito.');
  if (paths.some(executable => { const folder = gameFolder(executable); return folder && folder !== selected; })) {
    throw new Error('Outro jogo da Steam está aberto. Feche-o antes de enviar conquistas. Nenhum envio foi feito.');
  }
}

module.exports = { assertNoOtherSteamGame, gameFolder, selectedInstallDir };
