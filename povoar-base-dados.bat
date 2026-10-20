@echo off
chcp 65001 > nul
echo ======================================================================
echo           HOSPITALCARE — POVOAMENTO DA BASE DE DADOS (HCM)
echo ======================================================================
echo.
cd /d %~dp0backend
npm run seed
echo.
echo Processo de povoamento concluído.
pause
