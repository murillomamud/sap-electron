@echo off
set "SAP_GUI_PATH=C:\Program Files (x86)\SAP\FrontEnd\SAPgui\sapshcut.exe"
set "SAP_GUI_PARAMS=%*"
start "" "%SAP_GUI_PATH%" %SAP_GUI_PARAMS%
