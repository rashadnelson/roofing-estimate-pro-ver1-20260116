# PowerShell script to kill a process using a specific port
# Usage: .\scripts\kill-port.ps1 3001

param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

Write-Host "🔍 Checking for processes using port $Port..." -ForegroundColor Cyan

$connections = netstat -ano | findstr ":$Port"
if (-not $connections) {
    Write-Host "✅ Port $Port is free" -ForegroundColor Green
    exit 0
}

Write-Host "📋 Found processes using port $Port:" -ForegroundColor Yellow
$connections | ForEach-Object {
    Write-Host "  $_" -ForegroundColor Gray
}

# Extract PIDs
$pids = $connections | ForEach-Object {
    if ($_ -match '\s+(\d+)$') {
        $matches[1]
    }
} | Select-Object -Unique

foreach ($pid in $pids) {
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "🛑 Killing process: $($process.ProcessName) (PID: $pid)" -ForegroundColor Red
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
        
        # Verify it's killed
        $stillRunning = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if (-not $stillRunning) {
            Write-Host "✅ Successfully killed process $pid" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Process $pid is still running" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n✅ Port $Port should now be free" -ForegroundColor Green
