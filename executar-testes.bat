@echo off
chcp 65001 > nul
echo ======================================================================
echo           HOSPITALCARE — EXECUÇÃO DE TESTES UNITÁRIOS E E2E
echo ======================================================================
echo.

echo [1/2] Executando testes do Backend (Node.js/Vitest)...
cd /d %~dp0backend
call npm test
if %errorlevel% neq 0 (
    echo ❌ Falha nos testes do Backend!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Executando testes do Frontend (Vue 3/Vitest)...
cd /d %~dp0frontend
call npm test
if %errorlevel% neq 0 (
    echo ❌ Falha nos testes do Frontend!
    pause
    exit /b %errorlevel%
)

echo.
echo ======================================================================
echo  ✅ SUCESSO: Todos os testes (35/35) passaram com distinção!
echo ======================================================================
pause
