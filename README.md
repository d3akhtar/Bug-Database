<<<<<<< HEAD
This is a Bug Report System that currently utilizes HTML, CSS, JavaScript, NodeJS, Bootstrap, SQL, and JQuery. The purpose of this website is to let users input bugs/errors into a database. 

SQL and Node, along with some node packages are required.
=======
The Bug Report System is a program designed to let users log bugs/errors into a database. 
>>>>>>> ahmad-branch

## Requirements: ##
- SQL (Server) 8.0.36 - https://dev.mysql.com/downloads/installer/
	- in the "Accounts and Roles" section, click add user with the username "bugbytes" and leave the password section empty for that user. Otherwise, stick with the default settings.
- Node js v20.10.0-x64 - https://nodejs.org/en/download

## Setup: ##
- Run "installModules.bat" on windows to install the necessary node files
- When starting the server for the first time the database will be created automatically with the default username and password "admin1" : "1234"

## Usage: ##
- Start the server using "runServer.bat" or by typing "node ./server.js" in a terminal in the same folder as "server.js"
- Type "localhost:3000" into your browser (while the server is running) and you should be directed to the main page

## Features: ##
- Start a new bug report
- Contribute to a bug report
- Close the report 
- view progress in the form a graph
- Admin functions:
	- Add users
	- Remove users
	- Reset users' passwords
