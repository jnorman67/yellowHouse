export class NestLib {
	private _nest: any;
	private _nest_serial_number: string;

	constructor() {
		let user = process.env.NEST_USER_NAME,
		    pwd = process.env.NEST_PASSWORD;
			
		this._nest_serial_number = process.env.NEST_SERIAL_NUMBER;
						
		if (typeof user == 'undefined' || typeof pwd == 'undefined' || typeof this._nest_serial_number == 'undefined') {
			throw('Define NEST_USER_NAME, NEST_PASSWORD, and NEST_SERIAL_NUMBER');
		}
		this._nest = require('nest-thermostat').init(user, pwd);
	}

	celsiusToFahrenheit(temp) {
		return Math.round(temp * (9 / 5.0) + 32.0);
	}
	
	getEverything(callback: (info:any)=>void) {
		let me = this;
		
		me._nest.getInfo(me._nest_serial_number, function(data) {
			callback(data);
		});
	}

	getBasics(callback: (info:any)=>void) {
		let me = this;
		
		me._nest.getInfo(me._nest_serial_number, function(data) {
			callback({
				current: me.celsiusToFahrenheit(data.current_temperature),
				targetHigh: me.celsiusToFahrenheit(data.target_temperature_high),
				targetLow: me.celsiusToFahrenheit(data.target_temperature_low)
			});
		});	
	}
	
	getHvacState(callback: (info:any)=>void) {
		let me = this;
		
		me._nest.getInfo(me._nest_serial_number, function(data) {
			callback({
				// TODO: implement
			});
		});	
	}
}
