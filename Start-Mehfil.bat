@echo off
title Mehfil - Ambient Qawwali Radio
cls
echo =====================================================================
echo                     MEHFIL (محفل / महफ़िल)
echo                  Free Ambient Qawwali Radio
echo =====================================================================
echo.
echo Launching local server to ensure full, unrestricted audio playback...
echo.

:: Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [✓] Starting via Python server at http://localhost:3000 ...
    start "" "http://localhost:3000"
    python -m http.server 3000
    goto end
)

:: Check if Node / npx is available
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [✓] Starting via npx serve at http://localhost:3000 ...
    start "" "http://localhost:3000"
    npx serve -l 3000 .
    goto end
)

:: Fallback to built-in Windows PowerShell HTTP Listener
echo [✓] Starting via Windows built-in PowerShell server at http://localhost:3000 ...
start "" "http://localhost:3000"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:3000/'); $listener.Start(); Write-Host 'Mehfil Radio active at http://localhost:3000. Press Ctrl+C to close.'; while($listener.IsListening){ $ctx = $listener.GetContext(); $sub = $ctx.Request.Url.LocalPath.TrimStart('/'); if([string]::IsNullOrEmpty($sub)){ $sub = 'index.html' }; $file = Join-Path (Get-Location) $sub; if(Test-Path $file){ $b = [System.IO.File]::ReadAllBytes($file); $ext = [System.IO.Path]::GetExtension($file); $t = switch($ext){ '.html'{'text/html; charset=utf-8'} '.css'{'text/css'} '.js'{'application/javascript'} '.json'{'application/json'} '.svg'{'image/svg+xml'} default{'application/octet-stream'} }; $ctx.Response.ContentType = $t; $ctx.Response.OutputStream.Write($b, 0, $b.Length) } else { $ctx.Response.StatusCode = 404 }; $ctx.Response.Close() }"

:end
pause
