modulejs.define('validations', function() {
	return {
		common: {
			// Is Empty?
			isEmpty: function(string) {
				return string === '' ? 
					true : false;
			},
			// Min Char
			minChar: function(string, minValue) {
				return string.length >= minValue ?
					true : false;
			}
		},
		regex: {
			// Validate Alphanumeric
			alphanumeric: function(alphanumeric) {
				return /^[a-zA-ZâÂãÃáÁàÀêÊéÉèÈíÍìÌôÔõÕóÓòÒúÚùÙûÛçÇ\d\-' '\s]+$/i
					.test(alphanumeric) ? true :false;
			},
			// Validate Name
			fullName: function(name) {
				return /^[a-zA-ZâÂãÃáÁàÀêÊéÉèÈíÍìÌôÔõÕóÓòÒúÚùÙûÛçÇ' ']{3,999}$/i
					.test(name) ? true : false;
			},
			// Validate E-mail
			email: function(email) {
				return /^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/
					.test(email) ? true : false;		
			},
			// Validate Telephone
			telephone: function(telephone) {
				return /^\(\d{2}\)[\s-]?\d{4}-\d{4}$/
					.test(telephone) ? true : false;
			},
			// Validate Cellphone
			cellphone: function(cellphone) {
				return /^\(\d{2}\)[\s-]?\d{5}-\d{4}$/
					.test(cellphone) ? true : false;
			},
			// Validate Date
			date: function(date) {
				return /^(\d{2})\/(\d{2})\/(\d{4})$/
					.test(date) ? true : false;		
			},
			// Validate Hour
			hour: function(hour) {
				return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
					.test(hour) ? true : false;		
			}
		}
	}
});