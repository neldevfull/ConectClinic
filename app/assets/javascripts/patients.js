$(document).ready(function() {  	
	var $patient     = $('.new_patient');
	var $editPatient = $('.edit_patient');
	var $findPatient = $('#find_patient'); 
	var $showPatient = $('#show_patient');
	var $progressBar = $('#progressbar'); 
	// Call function that loads the masks
	loadMasksPatients();
	// Patient search by AJAX
	$findPatient.on('ajax:success', function(e, data) {		
		loadAjax(data, '#grid_patient', '#grid_patient');
		$('#search_name').val('');
	});
	// Patient new by AJAX		
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
	// Function to change the layout 
	function loadAjax(_data, _find, _append) {
		var content = $(_data).find(_find);						
    	$(_append).empty().append(content);
	}
	function isPatient(_data, _find) {
		if($(_data).find(_find).length > 0)
			cleanFields();		
	}
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
			var val = $progressBar.progressbar( "value" ) || 0;	
			$progressBar.progressbar( "value", val + 1 );
			if ( val < 99 ) {
               setTimeout( progress, 100 );
            }
		}
	});
});
// Clean Fields
function cleanFields() {
	$('#patient_name').val('');
	$('#patient_email').val('');
	$('#patient_telephone').val('');
	$('#patient_cellphone').val('');
	$('#patient_birth').val('');
	$('#patient_mailAccept').val('');
}
// Load masks into input form 
function loadMasksPatients() {
	$('#patient_birth').inputmask('99/99/9999');
	$('#patient_telephone').inputmask('(99) 9999-9999');
	$('#patient_cellphone').inputmask('(99) 99999-9999');	
} 