var patientForm = {
	// Validate fields
	validateFields: function() {
		var msg = '';
		$name       = $('#patient_name');		
		$email      = $('#patient_email'); 
		$telephone  = $('#patient_telephone');
		$cellphone  = $('#patient_cellphone');
		$birth      = $('#patient_birth');
		$gender     = $('input[name="patient[gender]"]');		

		// Validate Name
		if($name.val() != '') {	
			if($name.val().length >= 3) {				
				if(!(/^[a-zA-ZâÂãÃáÁàÀêÊéÉèÈíÍìÌôÔõÕóÓòÒúÚùÙûÛçÇ,-:.;1234567890?!' ']{3,999}$/i
					.test($name.val()))) {
					msg += 'Nome não é valido';				
				}			
			}
			else
				msg += 'Nome deve ter no mínimo 3 letras';		
		}
		else
			msg += 'Nome não pode ficar em branco';
		// Validate E-mail
		if($email.val() != '') {			
			if(!(/^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/
				.test($email.val()))) {
				msgIsEmpty();
				msg += 'Email não é valido';
			}
		}
		// Validate Telephones 		
		if($telephone.val() != '' ||
			$cellphone.val() != '') {
			if($telephone.val() != '') {
				if(!(/^\(\d{2}\)[\s-]?\d{4}-\d{4}$/.test($telephone.val()))) {
					msgIsEmpty();
					msg += 'Telefone não é valido';
				}
			}
			if($cellphone.val() != '') {
				if(!(/^\(\d{2}\)[\s-]?\d{5}-\d{4}$/.test($cellphone.val()))) {
					msgIsEmpty();
					msg += 'Celular não é valido';
				}
			}
		}
		else{
			msgIsEmpty();
			msg += 'Telefone ou Celular não pode ficar em branco';
		}
		// Birth
		if($birth.val() != '') {
			if(!(/^(\d{2})\/(\d{2})\/(\d{4})$/.test($birth.val()))) {
				msgIsEmpty();
				msg += 'Nascimento não é valido';
			}
		}
		// Gender
		if($gender[0].value == 'false')
			$gender[0].value = 'male'			
		if($gender[0].value != 'male' || $gender[1].value != 'female') {
			msgIsEmpty();
			msg += 'Sexo não deve possuir esse valor';
		}
		else {			
			if($('input[id="patient_gender_male"]:checked').length <= 0 &&
				$('input[id="patient_gender_female"]:checked').length <= 0) {
				msgIsEmpty();
				msg += 'Sexo não pode ficar em branco';						
			}
		}
		// MailAccept
		if($('input[id="patient_mailAccept"]:checked').length > 0 &&
			$email.val() == '') {
			msgIsEmpty();
			msg += 'E-mail deve ser preenchido';
		}
		// Case error
		if(msg != '') {
			$('#_patient_msg').empty().append(
				'<div class="alert alert-danger" role="alert">' +
				'Erro ao Salvar: ' + msg + 
				'</div>'
			);			
			return false;		
		}
		// Case Success!
		return true;
		// Check if message is empty
		function msgIsEmpty() {
			msg += msg != '' ? ', ' : '';
		}
	},
	// Clean fields
	cleanFields: function() {
		$('#patient_name').val('');
		$('#patient_email').val('');
		$('#patient_telephone').val('');
		$('#patient_cellphone').val('');
		$('#patient_birth').val('');	
		$('#patient_mailAccept').removeAttr('checked');
		$("input:radio").attr("checked", false);
	},
	// Load masks into input form 
	loadMasks: function() {
		$('#patient_birth').inputmask('99/99/9999');
		$('#patient_telephone').inputmask('(99) 9999-9999');
		$('#patient_cellphone').inputmask('(99) 99999-9999');	
	}
}
// jQuery Events
$(document).ready(function() {  	
	var $patient     = $('.new_patient');
	var $editPatient = $('.edit_patient');
	var $findPatient = $('#find_patient'); 
	var $showPatient = $('#show_patient');
	var $progressBar = $('#progressbar'); 
	// Call function that loads the masks
	patientForm.loadMasks();
	// Patient search by AJAX
	$findPatient.on('ajax:success', function(e, data) {		
		loadAjax(data, '#grid_patient', '#grid_patient');
		$('#search_name').val('');
	});
	// Patient new by AJAX		
	$patient.on('ajax:beforeSend', function() {			 			
		var success = patientForm.validateFields();
		if(success === false) {
			loadProgressBar(100, true);
			return false;
		}
		else
			return true;
	});
	$patient.on('ajax:send', function(e, data) {			 	
		loadProgressBar(25, false);					
	});
	$patient.on('ajax:success', function(e, data) {			 	
		loadAjax(data, '#_patient_msg', '#_patient_msg');								
		isPatient(data, '.alert-success');
		loadProgressBar(100, true);
	});
	// Patient edit by AJAX
	$editPatient.on('ajax:send', function(e, data) {											
		loadProgressBar(25, false);
	});
	$editPatient.on('ajax:success', function(e, data) {											
		loadAjax(data, '#_patient_msg', '#_patient_msg');				
		loadProgressBar(100, true);
	});	 
	// Load ProgressBar
	function loadProgressBar(value, isFinalized) {
		$progressBar.progressbar('value', value);
		if(isFinalized === true) {			
			setTimeout(function(){
				$('#progressbar').css('display', 'none');
			}, 500);
		}
	}
	// Button event to new patient
	$('._btn-confirm').click(function() {
		$('#progressbar').progressbar(function() {});
		$progressBar.css('display', 'block');
		$progressBar.progressbar('value', 0);
		progress();

		function progress() {
			var value = $progressBar.progressbar("value") || 0;	
			$progressBar.progressbar( "value", ++value );
			if (value < 99) {
               setTimeout( progress, 100 );
            }
		}
	});
});
// Function to change the layout 
function loadAjax(_data, _find, _append) {
	var content = $(_data).find(_find);						
	$(_append).empty().append(content);
}
// Is Patient?
function isPatient(_data, _find) {
	if($(_data).find(_find).length > 0)
		patientForm.cleanFields();
}
 