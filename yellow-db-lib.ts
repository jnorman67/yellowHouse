export class YellowDbLib {
	private _mysql: any;
	private _conn: any;

	constructor() {
		this._mysql = require('mysql');
		this.connect();
	}
	
	connect() {
		this._conn = this._mysql.createConnection({
		    host: "yellowhouse",
		    user: "yellow",
		    password: "house",
		    database: 'yellowhouse'
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
		