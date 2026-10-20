@echo off
chcp 65001 > nul
echo ======================================================================
echo           HOSPITALCARE — SISTEMA HOSPITALAR (HCM MOÇAMBIQUE)
echo                     INICIALIZAÇÃO DO AMBIENTE
echo ======================================================================
echo.

echo [1/2] A iniciar o Backend (Porta 5000)...
start "HospitalCare Backend [Porta 5000]" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] A iniciar o Frontend (Porta 9000)...
start "HospitalCare Frontend [Porta 9000]" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ✅ Ambos os servidores foram iniciados com sucesso!
echo.
echo - Frontend Quasar:   http://localhost:9000
echo - Backend API REST:  http://localhost:5000/api
echo - Swagger Docs:      http://localhost:5000/api/docs
echo - Health Check:      http://localhost:5000/health
echo.
echo Prima qualquer tecla para fechar esta janela...
pause > nul
