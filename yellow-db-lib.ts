export class YellowDbLib {
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
	
	getCurrentSolar(callback: (info: any) => void) {
		let sql = `select * from solar order by ts desc limit 1`;
		this._conn.query(sql, function (err, result) {
			if (err) throw err;
			callback(result[0]);
		});
	}

	getSolarHistory(callback: (points: string[])=>void) {
		let sql = `select * from solar order by ts asc`;
		this._conn.query(sql, function (err, result) {
			if (err) throw err;
			
			let vals = [];
			for (let rec of result) {
				let dt = new Date(Date.parse(rec.ts)),
				    yr = dt.getFullYear(),
					mo = dt.getMonth() + 1,
					dy = dt.getDate(),
					hr = dt.getHours(),
					mi = dt.getMinutes(),
					sc = dt.getSeconds();
				
				let dateString = `${yr}-${mo}-${dy} ${hr}:${mi}:${sc}`,
				    solarPlus = rec.solarplus,
				    demand = rec.grid + rec.solarplus;
					
				vals.push(`${dateString},${solarPlus},${demand}`);
				
			}
			callback(vals); 
		});
	}		
	
	getWeather(callback: (info: any)=> void) {
		let sql = `select * from weather order by ts desc limit 1`;
		this._conn.query(sql, function (err, result) {
			if (err) throw err;
			callback(result[0]);
		});
	}
	
	getThermostat(callback: (info: any)=> void) {
		let sql = `select * from thermostat order by ts desc limit 1`;
		this._conn.query(sql, function (err, result) {
			if (err) throw err;
			callback(result[0]);
		});
	}	
}
		