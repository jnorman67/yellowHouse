/*
||
||
||  I created an account at openweathermap.org
||
||  Username: jnorman67
||  PW: m....
||
||  I got the "appid" key from this site
||
||  Example results:
||
||{ coord: { lon: -97.71, lat: 30.38 },
||  weather:
||   [ { id: 804,
||       main: 'Clouds',
||       description: 'overcast clouds',
||       icon: '04n' } ],
||  base: 'stations',
||  main:
||   { temp: 282.01,
||     pressure: 1022,
||     humidity: 100,
||     temp_min: 281.15,
||     temp_max: 284.15 },
||  visibility: 16093,
||  wind: { speed: 6.2, deg: 10, gust: 9.3 },
||  clouds: { all: 90 },
||  dt: 1514685360,
||  sys:
||   { type: 1,
||     id: 2557,
||     message: 0.0039,
||     country: 'US',
||     sunrise: 1514726846,
||     sunset: 1514763651 },
||  id: 0,
||  name: 'Austin',
||  cod: 200 }
*/

import * as WebRequest from 'web-request';

export class WeatherLib {
	_url: string;
	
	constructor() {
		let requiredEnvVariables = [
			'OPENWEATHERMAP_APPID',
			'OPENWEATHERMAP_ZIP'
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
	
		let appid = process.env.OPENWEATHERMAP_APPID,
			zip = process.env.OPENWEATHERMAP_ZIP;
		
		this._url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${appid}`
console.log(this._url);		
	}
	
	private kTof(K) {
		return 9/5 * (K - 273) + 32;
	}
	
	async getCurrent(callback) {
		let result = await WebRequest.get(this._url);

		let info = JSON.parse(result.content),
			main = info.main,
			weather = info.weather[0],
			wind = info.wind;
				
		callback({
			temp: this.kTof(main.temp),
			pressure: main.pressure,
			humidity: main.humidity,
			weatherMain: weather.main,
			weatherDesc: weather.description,
			weatherIcon: weather.icon,
			windSpeed: wind.speed,
			windDeg: wind.deg,
			windGust: wind.gust||0,
			clouds: info.clouds.all,
			sunrise: info.sys.sunrise,
			sunset: info.sys.sunset
		});
	}
}

