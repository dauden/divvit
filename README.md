To run Application, make sure you have installed NodeJS and Mongobd yet.

	I) Create database & correcly data
		1) change database directory 
		2) run Import data base from CSV file
		$ mongoimport --db divvit --collection orders --file ./database/data.csv  --type csv  --headerline
		3) end then run data migration 
		$ mongo divvit migration.js 

	II) install node packages 
		1) change to root directory of application
		2) npm install 

	II) Run application
		1) run server 
		$ nodemon app.js
		2) open url http://localhost:4000/ in your browser 
