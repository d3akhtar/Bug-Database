The Bug Report System is a program designed to let users log bugs/errors into a database. 

## Requirements: ##
- SQL (Server) 8.0.36
	https://dev.mysql.com/downloads/installer/
- Node js v20.10.0-x64
	https://nodejs.org/en/download

## Setup: ##
- Run "installModules.bat" on windows to install the necessary node files
	- if that does not work, run the following commands in a terminal in the same folder as "server.js"
		npm install express
		npm install express-session
		npm install mysql
- When starting the server for the first time the database will be created automatically with the default username and password "admin1" : "1234"

## Usage: ##
- Start the server using "runServer.bat" or by typing "node ./server.js" in a terminal in the same folder as "server.js"
- Type "localhost:3000" into your browser (while the server is running) and you should be directed to the main page

## Features: ##
- Start a new bug report
- Contribute to a bug report
- Close the report 
- view progress in the form a graph

- Admin functions
-- Add users
-- Remove users
-- Reset users' passwords
