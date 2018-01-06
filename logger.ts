

export class Logger {
	private _mysql: any;
	private _conn: any;

	constructor() {
		this._mysql = require('mysql');
		this.connect();
	}
	
	connect() {
		let requiredEnvVariables = [
			'YELLOW_HOUSE_DB_NAME',
			'YELLOW_HOUSE_DB_HOST',
			'YELLOW_HOUSE_DB_USER',
			'YELLOW_HOUSE_DB_PASSWORD'
		];
		    

		let fail = false;
		for (let envVar of requiredEnvVariables) {
			if (typeof process.env[envVar] == 'undefined') {
				fail = true;
			}
		}
		if (fail) {
			throw('Must define ' + requiredEnvVariables.join());
		}

	
		this._conn = this._mysql.createConnection({
		    host: process.env.YELLOW_HOUSE_DB_HOST,
		    user: process.env.YELLOW_HOUSE_DB_USER,
		    password: process.env.YELLOW_HOUSE_DB_PASSWORD,
		    database: process.env.YELLOW_HOUSE_DB_NAME
		});


		this._conn.connect(function(err) {
		  if (err) throw err;
		  console.log("Connected to database");
		});
	}
	
	getCurrentTime() {
		let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
		let tm = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
		return tm;
	}

	logSolar(rec) {
		let ts = this.getCurrentTime();

		let sql = `INSERT INTO solar (ts, grid, solar, solarplus) VALUES ('${ts}', ${rec.grid}, ${rec.solar}, ${rec.solarPlus})`;
		this._conn.query(sql, function (err, result) {
			if (err) throw err;
		});
	}
		
		
	logThermostat(rec) {
		let ts = this.getCurrentTime();

		let sql = `INSERT INTO thermostat (ts, current, targetLow, targetHigh) VALUES ('${ts}', ${rec.current}, ${rec.targetLow}, ${rec.targetHigh})`;
		this._conn.query(sql, function (err, result) {
			if (err) throw err;
		});
	}
	
	logWeather(rec) {
		let ts = this.getCurrentTime();

		let fields = 'ts, temp, pressure, humidity, weatherMain, weatherDesc, weatherIcon, windSpeed, windDeg, windGust, clouds, sunrise, sunset',
		    values = [
				`'${ts}'`, 
				rec.temp,
				rec.pressure, 
				rec.humidity,
				`'${rec.weatherMain}'`, 
				`'${rec.weatherDesc}'`, 
				`'${rec.weatherIcon}'`, 
				rec.windSpeed, 
				rec.windDeg, 
				rec.windGust,
				rec.clouds, 
				rec.sunrise, 
				rec.sunset
			].join(',');

		var sql = `INSERT INTO weather (${fields}) VALUES (${values})`;
		this._conn.query(sql, function (err, result) {
			//if (err) throw err;
		});
	}
}
		
	