import { LightGuageLib } from "./lightguage-lib";
import { NestLib } from "./nest-lib";
import { WeatherLib } from "./weather-lib";
import { Logger } from "./logger";

let lg = new LightGuageLib(),
    nest = new NestLib(),
	weather = new WeatherLib(),
	logger = new Logger();

let verbose = false;

const SOLAR_INTERVAL = 1000;
const THERMOSTAT_INTERVAL = 5 * 60 * 1000;
const WEATHER_INTERVAL = 5 * 60 * 1000;


/*
||
||    Solar
||
*/
setInterval(function() {
	lg.getInst((res) => {
		if (verbose) {
			console.log('SOLAR =================================================');
			console.log('timestamp: ' + res.timestamp);
			console.log(res.sinceOutage + ' seconds since last outage');
			console.log('grid: ' + res.grid);
			console.log('solar: ' + res.solar);
			console.log('solarPlus: ' + res.solarPlus);
		}

		logger.logSolar(res);
	});
}, SOLAR_INTERVAL);


/*
||
||    Nest data
||
*/
setInterval(function() {
	nest.getBasics((info) => {
		if (verbose) {
			console.log('THERMOSTAT =========================');
			console.log('current: ' + info.current);
			console.log('low target: ' + info.targetLow);
			console.log('high target: ' + info.targetHigh);
		}
		logger.logThermostat(info);
	});
	//nest.getEverything((info) => {
	//    console.log(info);	
	//});

}, THERMOSTAT_INTERVAL);


/*
||
||     Weather
||
*/
setInterval(function() {
	weather.getCurrent((info) => {
		if (verbose) {
			console.log('WEATHER =========================');
			console.log('temp: ' + info.temp);
			console.log('pressure: ' + info.pressure);
			console.log('humidity: ' + info.humidity);
		}
		logger.logWeather(info);
	});
}, WEATHER_INTERVAL);
