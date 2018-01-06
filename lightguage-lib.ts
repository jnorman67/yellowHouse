import * as WebRequest from 'web-request';
let parseString = require('xml2js').parseString;

export class LightGuageLib {
	private lg_host: string;

	constructor() {
		this.lg_host = process.env.LIGHTGAUGE_HOST;
		
		if (typeof this.lg_host == 'undefined') {
			throw('Must define LIGHTGAUGE_HOST');
		}
	}

    async getInst(callback: (res:any)=>void) {
		/*  Expect:
		<data serial="XXXXXXXXXXXXXXXX">
			<ts>1514408299</ts>
			<gen>1218152</gen>
			<r t="P" n="Grid">
				<v>-11431593101</v>
				<i>-48</i>
			</r>
			<r t="P" n="Solar">
				<v>146323678709</v>
				<i>488</i>
			</r>
			<r t="P" n="Solar+">
				<v>147499711734</v>
				<i>488</i>
			</r>
		</data>
		*/
		
		let p = 'v1&inst',
		    req = `http://${this.lg_host}/cgi-bin/egauge?${p}`;
		
        let result = await WebRequest.get(req);
        let content = result.content;

        parseString(content, function(err, result) {
            let data = result.data,
            r = data.r;

            let solarPlus = r.find((el) => {return el.$.n === 'Solar+'}),
                solar = r.find((el) => {return el.$.n === 'Solar'}),
                grid = r.find((el) => {return el.$.n === 'Grid'});
				
			
			let secs = data.ts;
			
			var t = new Date(1970, 0, 1),
			    tzOffset = new Date().getTimezoneOffset() * 60,
				fudgeFactor = 6 * 60;  // for some reason, the timestamp is about 6 minutes ago
				
			t.setSeconds(secs - tzOffset + fudgeFactor);

            callback({
				timestamp: t,
				sinceOutage: data.gen,  // seconds since last power outage?
       			grid: grid.i,
                solar: solar.i,
                solarPlus: solarPlus.i
            });
        });
    }
	
	async egaugeShow(opts, callback: (res:any)=>void ) {
		let params = [
			'e',
			'm',
			'C',
			's=2',
			'n=960'
			];
		
		let p = params.join('&'),
		    req = `http://${this.lg_host}/cgi-bin/egauge-show?${p}`;
	
		let result = await WebRequest.get(req);
		
		parseString(result.content, function(err, res) {
			
		});
	}
	
	
}