@echo off
title TuBroTech Bot
color 0A
echo.
echo  ==========================================
echo   TuBroTech Bot - Asistente Virtual
echo  ==========================================
echo.
echo  Iniciando el chatbot...
echo.
cd /d "%~dp0tubrotech-bot"
node bot.js
echo.
echo  El bot se detuvo. Presiona cualquier tecla para cerrar.
pause > nul
