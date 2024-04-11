The Bug Report System is a program designed to let users log bugs/errors into a database. 

# Requirements: #
- SQL (Server) 8.0.36
	https://dev.mysql.com/downloads/installer/
- Node js v20.10.0-x64
	https://nodejs.org/en/download

Setup:
- Run "installModules.bat" on windows to install the necessary node files
	- if that does not work, run the following commands in a terminal in the same folder as "server.js"
		npm install express
		npm install express-session
		npm install mysql
- When starting the server for the first time the database will be created automatically with the default username and password "admin1" : "1234"

Usage:
- Start the server using "runServer.bat" or by typing "node ./server.js" in a terminal in the same folder as "server.js"
- Type "localhost:3000" into your browser (while the server is running) and you should be directed to the main page

Features: // this section is not finished yet
- Start a new bug report
- Close the report 
- View the process/status of the bug repair with e-mails notifying them at each stage/step.

- Each user will have to login with a valid username and password to gain access to the bug report form. 
- Graph that displays what types of bugs have occurred in the past and how often they have occurred. 
- When a bug is fixed, the developer who reported it and every other developer involved gets a notification via email.
