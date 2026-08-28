# Arma rom-gym-web\index.html a partir de ..\rom-gym.html
# Uso:  powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path (Split-Path -Parent $here) 'rom-gym.html'
$dst  = Join-Path $here 'index.html'

$head = @'
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#EFEFEC" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121316" media="(prefers-color-scheme: dark)">
<meta name="description" content="ROM GYM: registro de entrenamiento de hipertrofia. Rutinas, series y progresion de cargas.">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ROM GYM">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon.svg">
'@

$foot = @'

<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  });
}
</script>
</body>
</html>
'@

$utf8 = New-Object System.Text.UTF8Encoding($false)
$body = [System.IO.File]::ReadAllText($src, $utf8)
[System.IO.File]::WriteAllText($dst, ($head + $body + $foot), $utf8)

$kb = [math]::Round((Get-Item $dst).Length / 1KB, 1)
Write-Output "index.html generado: $kb KB"
