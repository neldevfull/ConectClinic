modulejs.define('patient', ['validationsForm'], 
	function(validationForm) {
	return function() {		
		// Patient Form
		var patientForm = {
			// Validate fields
			validateFields: function() {
				var messages = [];
				$name        = $('#patient_name').val();		
				$email       = $('#patient_email').val(); 
				$telephone   = $('#patient_telephone').val();
				$cellphone   = $('#patient_cellphone').val();
				$birth       = $('#patient_birth').val();
				$genderName  = $('input[name="patient[gender]"]');
				$genderId	 = 'patient_gender';
				$mailAccept  = 'patient_mail_accept';
				// Call Validation
				addMessage(validationForm.fullName($name));			
				addMessage(validationForm.email($email));
				addMessage(validationForm.telephones(
					$telephone, $cellphone));
				addMessage(validationForm.date(
					$birth, false));
				addMessage(validationForm.gender(
					$genderName, $genderId));
				addMessage(validationForm.mailAccept(
					$mailAccept, $email));

				// Case error
				if(messages.length > 0) {
					var msg;
					for(var i = 0; i < messages.length; i++) {
						if(i !== 0)
							msg += ', ' + messages[i];
						else 					
							msg = messages[i];				
					}			
					$('#_patient_msg').empty().append(
						'<div class="alert alert-danger" role="alert">' +
						'Erro ao Salvar: ' + msg + 
						'</div>'
					);			
					return false;		
				}
				// Case Success!
				else
					return true;
				// Check if message is empty
				function addMessage(message) {
					if(message !== true) 
						messages.push(message);
				}
			},
			// Clean fields
			cleanFields: function() {
				$('#patient_name').val('');
				$('#patient_email').val('');
				$('#patient_telephone').val('');
				$('#patient_cellphone').val('');
				$('#patient_birth').val('');	
				$('#patient_mail_accept').removeAttr('checked');
				$("input:radio").attr("checked", false);
			},
			// Load masks into input form 
			loadMasks: function() {
				$('#patient_birth').inputmask('99/99/9999');
				$('#patient_telephone').inputmask('(99) 9999-9999');
				$('#patient_cellphone').inputmask('(99) 99999-9999');	
			}
		};
		// jQuery Events
		$(function() {  	
			var $patient     = $('.new_patient');
			var $editPatient = $('.edit_patient');	 	
			var $progressBar = $('#progressbar'); 
			// Call function that loads the masks
			patientForm.loadMasks();
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
			$editPatient.on('ajax:beforeSend', function() {
				var success = patientForm.validateFields();
				if(success === false) {
					loadProgressBar(100, true);
					return false;
				}
				else
					return true;
			});
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
		// Is Patient?
		function isPatient(_data, _find) {
			if($(_data).find(_find).length > 0)
				patientForm.cleanFields();
		}
		// Change the layout 
		function loadAjax(_data, _find, _append) {
			var content = $(_data).find(_find);						
			$(_append).empty().append(content);
		}		
	}
});