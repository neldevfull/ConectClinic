var validationForm = {
	// Validate Name
	fullName: function(name) {
		if(!(validation.common.isEmpty(name))) {
			if(validation.common.minChar(name, 3)) {				
				if(!(validation.regex.fullName(name)))
					return 'Nome não é valido';	 						
			}
			else
				return 'Nome deve ter no mínimo 3 letras';
		}
		else
			return 'Nome não pode ficar em branco';
		return true;
	},
	// Validate E-mail
	email: function(email) {
		if(!(validation.common.isEmpty(email))) {			
			if(!(validation.regex.email(email)))				
				return 'E-mail não é valido';
		}
		return true;
	},
	// Validate Telephones
	telephones: function(telephone, cellphone) {
		var telEmpty = validation.common.isEmpty(telephone);
		var celEmpty = validation.common.isEmpty(cellphone);
		if(!telEmpty || !celEmpty) {			
			if(!telEmpty) {				
				if(!(validation.regex.telephone(telephone))) {					
					return 'Telefone não é valido';
				}
			}
			if(!celEmpty) {				
				if(!(validation.regex.cellphone(cellphone))) {					
					return 'Celular não é valido';
				}
			}
		}
		else
			return 'Telefone ou Celular não pode ficar em branco';
		return true;
	},
	// Validate Date
	date: function(date, valEmpty) {
		if(!(validation.common.isEmpty(date))) {
			if(!(validation.regex.date(date)))
				return 'Data não é valida';
		}
		else {
			if(valEmpty)
				return 'Data não pode ficar em branco';
		}
		return true;
	},
	// Validate Hourly
	hourly: function(hourIni, hourEnd) {
		var hourIniEmpty = validation.common.isEmpty(hourIni);
		var hourEndEmpty = validation.common.isEmpty(hourEnd); 
		if(!hourIniEmpty || !hourEndEmpty) {			
			if(!hourIniEmpty) {				
				if(!(validation.regex.hour(hourIni)))
					return 'Hora inicial não é valido';
			}
			else 
				return 'Hora inicial não pode ficar em branco';
			if(!hourEndEmpty) {
				if(!validation.regex.hour(hourEnd))
					return 'Hora final não é valida';
			}
			else 
				return 'Hora final não pode ficar em branco';
		}	
		else 	
			return 'Horário não pode ficar em branco';
		return true;
	},
	// Validate Gender
	gender: function(name, id) {
		if(name[0].value === 'false')
			name[0].value = 'male'			
		if(name[0].value !== 'male' || name[1].value !== 'female') {			
			return 'Sexo não deve possuir esse valor';
		}
		else {			
			if($('input[id="' + id + '_male"]:checked').length <= 0 &&
				$('input[id="' + id + '_female"]:checked').length <= 0) {				
				return 'Sexo não pode ficar em branco';						
			}
		}
		return true;
	},
	// Validate MailAccept
	mailAccept: function(id, email) {
		if($('input[id="' + id + '"]:checked').length > 0 &&
			email === '') {			
			return 'E-mail deve ser preenchido';
		}
		return true;
	}
}