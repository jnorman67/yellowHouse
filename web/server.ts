const express = require('express');
const app = express();

import { YellowDbLib } from "../yellow-db-lib";
let yellowDbLib = new YellowDbLib();

import { NestLib } from "../nest-lib";

app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/currentSolar', function(req, res) {
	yellowDbLib.getCurrentSolar((info) => {
		res.send(info);
	});
});

app.get('/weather', function(req, res) {
	yellowDbLib.getWeather((info) => {
		res.send(info);
	});
});

app.get('/thermostat', function(req, res) {
	yellowDbLib.getThermostat((info) => {
		res.send(info);
	});
});

app.get('/allThermostat', function(req, res) {
	let nestLib = new NestLib();
	
	nestLib.getEverything((info) => {
		
		let entries = [];
		for (let k in info) {
			let entry = `<tr><td>${k}</td><td>${info[k]}</td></tr>`;
			entries.push(entry);
		}
		let content = entries.join('');
		res.send(`<table>${content}</table>`);	
	});
});

app.get('/solarHistory', function(req, res) {
	yellowDbLib.getSolarHistory((points) => {
		res.send({
			header: "Date,Solar,Demand",
			points: points
		});
	});
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});