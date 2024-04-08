#!/bin/bash

# Prompt for MySQL root password
read -s -p "Enter MySQL root password: " mysql_password
echo

# Run MySQL commands
mysql -u root -p"$mysql_password" <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
exit;
EOF

# Prompt to press any key to continue
read -n 1 -s -r -p "Press any key to continue..."