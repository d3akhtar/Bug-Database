@echo off

(
    echo ALTER USER 'root'@'localhost' IDENTIFIED BY '';
    echo FLUSH PRIVILEGES;
) > temp.sql

echo exit >> temp.sql

mysql -u root < temp.sql

del temp.sql

echo Setup complete. Press any key to continue...
pause >nul
