param(
  [ValidateSet('probe', 'unlock')][string]$Mode,
  [string]$DllPath,
  [uint32]$AppId
)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
try {
  $inputData = [Console]::In.ReadToEnd() | ConvertFrom-Json
  if (-not [IO.File]::Exists($DllPath)) { throw 'Biblioteca Steamworks não encontrada.' }
  Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

public static class SteamNative {
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern IntPtr LoadLibraryEx(string path, IntPtr reserved, uint flags);
    [DllImport("kernel32.dll", CharSet = CharSet.Ansi, SetLastError = true)]
    private static extern IntPtr GetProcAddress(IntPtr module, string name);
    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool FreeLibrary(IntPtr module);

    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    [return: MarshalAs(UnmanagedType.I1)]
    private delegate bool InitFn();
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate void VoidFn();
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate IntPtr InterfaceFn();
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate uint AppIdFn(IntPtr self);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate ulong SteamIdFn(IntPtr self);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate int HandleFn();
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate IntPtr ClientStatsFn(IntPtr client, int user, int pipe, byte[] version);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate uint CountFn(IntPtr self);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    private delegate IntPtr NameFn(IntPtr self, uint index);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    [return: MarshalAs(UnmanagedType.I1)]
    private delegate bool GetFn(IntPtr self, byte[] name, out byte achieved);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    [return: MarshalAs(UnmanagedType.I1)]
    private delegate bool SetFn(IntPtr self, byte[] name);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    [return: MarshalAs(UnmanagedType.I1)]
    private delegate bool StoreFn(IntPtr self);
    [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
    [return: MarshalAs(UnmanagedType.I1)]
    private delegate bool RequestFn(IntPtr self);

    private static T Export<T>(IntPtr module, string name) where T : class {
        IntPtr ptr = GetProcAddress(module, name);
        if (ptr == IntPtr.Zero) throw new Exception("Steamworks não oferece " + name + ".");
        return (T)(object)Marshal.GetDelegateForFunctionPointer(ptr, typeof(T));
    }
    private static string Utf8(IntPtr ptr) {
        if (ptr == IntPtr.Zero) return "";
        int len = 0;
        while (len < 1024 && Marshal.ReadByte(ptr, len) != 0) len++;
        byte[] bytes = new byte[len]; Marshal.Copy(ptr, bytes, 0, len);
        return Encoding.UTF8.GetString(bytes);
    }
    public static Result Run(string dll, string mode, string[] ids, uint expectedAppId, string expectedSteamId) {
        IntPtr module = LoadLibraryEx(dll, IntPtr.Zero, 0x8);
        if (module == IntPtr.Zero) throw new Exception("Não foi possível carregar a biblioteca Steamworks do jogo (erro " + Marshal.GetLastWin32Error() + ").");
        bool initialized = false;
        try {
            InitFn init = Export<InitFn>(module, "SteamAPI_Init");
            VoidFn shutdown = Export<VoidFn>(module, "SteamAPI_Shutdown");
            VoidFn callbacks = Export<VoidFn>(module, "SteamAPI_RunCallbacks");
            IntPtr accessor = IntPtr.Zero;
            foreach (string version in new string[] { "v013", "v012", "v011", "v010", "v009", "v008" }) {
                accessor = GetProcAddress(module, "SteamAPI_SteamUserStats_" + version);
                if (accessor != IntPtr.Zero) break;
            }
            if (accessor == IntPtr.Zero) accessor = GetProcAddress(module, "SteamUserStats");
            InterfaceFn statsInterface = accessor == IntPtr.Zero ? null : (InterfaceFn)Marshal.GetDelegateForFunctionPointer(accessor, typeof(InterfaceFn));
            CountFn count = Export<CountFn>(module, "SteamAPI_ISteamUserStats_GetNumAchievements");
            NameFn name = Export<NameFn>(module, "SteamAPI_ISteamUserStats_GetAchievementName");
            GetFn get = Export<GetFn>(module, "SteamAPI_ISteamUserStats_GetAchievement");
            SetFn set = Export<SetFn>(module, "SteamAPI_ISteamUserStats_SetAchievement");
            StoreFn store = Export<StoreFn>(module, "SteamAPI_ISteamUserStats_StoreStats");
            if (!init()) throw new Exception("SteamAPI_Init falhou. Abra a Steam, confirme que possui o jogo e tente novamente.");
            initialized = true;
            IntPtr utilsAccessor = IntPtr.Zero;
            foreach (string version in new string[] { "v010", "v009", "v008", "v007" }) {
                utilsAccessor = GetProcAddress(module, "SteamAPI_SteamUtils_" + version);
                if (utilsAccessor != IntPtr.Zero) break;
            }
            if (utilsAccessor == IntPtr.Zero) utilsAccessor = GetProcAddress(module, "SteamUtils");
            if (utilsAccessor == IntPtr.Zero) throw new Exception("Não foi possível confirmar o App ID pela Steam. Nenhuma alteração foi feita.");
            IntPtr utils = ((InterfaceFn)Marshal.GetDelegateForFunctionPointer(utilsAccessor, typeof(InterfaceFn)))();
            if (utils == IntPtr.Zero) throw new Exception("A Steam não disponibilizou a identificação do jogo. Nenhuma alteração foi feita.");
            uint actualAppId = Export<AppIdFn>(module, "SteamAPI_ISteamUtils_GetAppID")(utils);
            if (actualAppId != expectedAppId) throw new Exception("App ID da Steam não corresponde ao jogo selecionado. Nenhuma alteração foi feita.");
            IntPtr userAccessor = IntPtr.Zero;
            foreach (string version in new string[] { "v023", "v022", "v021", "v020" }) {
                userAccessor = GetProcAddress(module, "SteamAPI_SteamUser_" + version);
                if (userAccessor != IntPtr.Zero) break;
            }
            if (userAccessor == IntPtr.Zero) userAccessor = GetProcAddress(module, "SteamUser");
            if (userAccessor == IntPtr.Zero) throw new Exception("Não foi possível confirmar a conta Steam. Nenhuma alteração foi feita.");
            IntPtr user = ((InterfaceFn)Marshal.GetDelegateForFunctionPointer(userAccessor, typeof(InterfaceFn)))();
            if (user == IntPtr.Zero) throw new Exception("A Steam não disponibilizou a conta atual. Nenhuma alteração foi feita.");
            string steamId = Export<SteamIdFn>(module, "SteamAPI_ISteamUser_GetSteamID")(user).ToString();
            if (steamId == "0") throw new Exception("A Steam não devolveu uma conta válida. Nenhuma alteração foi feita.");
            if (mode == "unlock" && steamId != expectedSteamId) throw new Exception("A conta Steam mudou desde a verificação. Nenhuma alteração foi feita.");
            IntPtr stats = IntPtr.Zero;
            if (statsInterface != null) stats = statsInterface();
            else {
                InterfaceFn clientAccessor = Export<InterfaceFn>(module, "SteamClient");
                HandleFn getUser = Export<HandleFn>(module, "SteamAPI_GetHSteamUser");
                HandleFn getPipe = Export<HandleFn>(module, "SteamAPI_GetHSteamPipe");
                ClientStatsFn getStats = Export<ClientStatsFn>(module, "SteamAPI_ISteamClient_GetISteamUserStats");
                IntPtr client = IntPtr.Zero;
                client = clientAccessor();
                if (client == IntPtr.Zero) throw new Exception("Não foi possível obter a interface SteamClient do jogo.");
                foreach (string version in new string[] { "STEAMUSERSTATS_INTERFACE_VERSION013", "STEAMUSERSTATS_INTERFACE_VERSION012", "STEAMUSERSTATS_INTERFACE_VERSION011", "STEAMUSERSTATS_INTERFACE_VERSION010" }) {
                    stats = getStats(client, getUser(), getPipe(), Encoding.ASCII.GetBytes(version + "\0"));
                    if (stats != IntPtr.Zero) break;
                }
            }
            if (stats == IntPtr.Zero) throw new Exception("A Steam não disponibilizou as conquistas deste jogo.");
            IntPtr requestPtr = GetProcAddress(module, "SteamAPI_ISteamUserStats_RequestCurrentStats");
            if (requestPtr != IntPtr.Zero) {
                RequestFn request = (RequestFn)Marshal.GetDelegateForFunctionPointer(requestPtr, typeof(RequestFn));
                request(stats);
            }
            Dictionary<string, bool> available = null;
            for (int attempt = 0; attempt < 40; attempt++) {
                callbacks();
                uint n = count(stats);
                if (n > 0 && n <= 5000) {
                    Dictionary<string, bool> next = new Dictionary<string, bool>(StringComparer.Ordinal);
                    bool ready = true;
                    for (uint i = 0; i < n; i++) {
                        string key = Utf8(name(stats, i));
                        byte achieved;
                        if (key.Length == 0 || !get(stats, Encoding.UTF8.GetBytes(key + "\0"), out achieved)) { ready = false; break; }
                        next[key] = achieved != 0;
                    }
                    if (ready) { available = next; break; }
                }
                Thread.Sleep(200);
            }
            if (available == null) throw new Exception("Não foi possível ler o estado das conquistas pela Steam. Nenhuma alteração foi feita.");
            Result result = new Result();
            result.ok = true;
            result.appId = actualAppId;
            result.steamId = steamId;
            result.total = available.Count;
            result.achievements = available;
            if (mode == "unlock") {
                if (ids == null || ids.Length != 1) throw new Exception("O envio experimental aceita uma conquista por confirmação.");
                HashSet<string> unique = new HashSet<string>(StringComparer.Ordinal);
                foreach (string id in ids) {
                    if (String.IsNullOrEmpty(id) || !unique.Add(id) || !available.ContainsKey(id))
                        throw new Exception("A seleção contém uma conquista desconhecida para este jogo. Nenhuma alteração foi feita.");
                }
                List<string> changed = new List<string>();
                foreach (string id in ids) {
                    if (available[id]) continue;
                    if (!set(stats, Encoding.UTF8.GetBytes(id + "\0"))) {
                        if (changed.Count > 0) store(stats);
                        throw new Exception("A Steam recusou a conquista " + id + ". As anteriores podem ter sido gravadas.");
                    }
                    changed.Add(id);
                }
                if (changed.Count > 0) {
                    if (!store(stats)) throw new Exception("StoreStats falhou. A gravação não foi confirmada; consulte o estado novamente.");
                    for (int i = 0; i < 10; i++) { callbacks(); Thread.Sleep(150); }
                }
                result.submitted = changed.ToArray();
                result.alreadyUnlocked = ids.Length - changed.Count;
            }
            return result;
        } finally {
            if (initialized) {
                try { Export<VoidFn>(module, "SteamAPI_Shutdown")(); } catch { }
            }
            FreeLibrary(module);
        }
    }
    public class Result {
        public bool ok;
        public uint appId;
        public string steamId;
        public int total;
        public Dictionary<string, bool> achievements;
        public string[] submitted;
        public int alreadyUnlocked;
    }
}
'@
  $ids = @($inputData.ids | ForEach-Object { [string]$_ })
  $result = [SteamNative]::Run($DllPath, $Mode, $ids, $AppId, [string]$inputData.expectedSteamId)
  [Console]::Out.WriteLine(($result | ConvertTo-Json -Compress -Depth 6))
} catch {
  [Console]::Out.WriteLine((@{ ok = $false; error = $_.Exception.Message } | ConvertTo-Json -Compress))
  exit 1
}
