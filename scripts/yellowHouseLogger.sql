create database yellowhouse;
GRANT ALL PRIVILEGES ON yellowhouse.* TO yellow@'%' IDENTIFIED BY 'house';

use yellowhouse;
create table solar (ts timestamp, grid int, solar int, solarplus int);
create table thermostat (ts timestamp, current int, targetLow int, targetHigh int);
create table hvac_state (ts timestamp, fan_on bool, heat_on bool, ac_on bool);

create table weather (ts timestamp, temp int, pressure int, humidity int, weatherMain varchar(50), weatherDesc varchar(50), weatherIcon varchar(5), windSpeed decimal(5,2), windDeg int, windGust decimal(5,2), clouds int, sunrise int, sunset int );

create index solar_ts on solar (ts);
create index weather_ts on weather (ts);
create index thermostat_ts on thermostat (ts);