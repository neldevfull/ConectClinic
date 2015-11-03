modulejs.define('util', function() { 
	return {
		// Parse Date
		parseDate: function(date, charOld, charNew) {
			var vDate = date.split(charOld);
			return vDate[2] + charNew + vDate[1] + charNew + vDate[0]; 	
		}, 
		// Parse Date to Moment
		parseDateToMoment: function(date, hour) {
			return $.fullCalendar.moment.utc(date + 'T' + hour + ':00');
		},
		// Parse Moment in Date
		parseMomentToDate: function(moment) {
			return (new Date(moment)).toISOString().slice(0, 10); 
		},
		// Parse Moment in Date
		parseMomentToHour: function(moment) {
			var hour = +/ (\d+):/.exec(moment)[1];
			var min  = +/:(\d+):/.exec(moment)[1];

			if(hour.toString().length == 1)
				hour = '0' + hour;	
			if(min.toString().length == 1)
				min = '0' + min;

			return hour.toString() + ':' + min.toString(); 
		}, 
	}
});