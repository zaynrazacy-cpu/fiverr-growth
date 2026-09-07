# FiverrGrowth AI Startup Script
Write-Host "=================================================" -ForegroundColor Green
Write-Host "🚀 Starting FiverrGrowth AI Platform..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Start Backend in background job
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"
Write-Host "📡 Backend starting at: http://localhost:5000 (Swagger: http://localhost:5000/api/docs)" -ForegroundColor Cyan

# Start Frontend in background job
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
Write-Host "🎨 Frontend Dashboard starting at: http://localhost:5173" -ForegroundColor Cyan

Write-Host "=================================================" -ForegroundColor Green
Write-Host "✅ Both services launched! Open http://localhost:5173 in your browser." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
