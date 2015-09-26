$(document).ready(function() {  	
	var $patient     = $('.new_patient');
	var $editPatient = $('.edit_patient');
	var $findPatient = $('#find_patient'); 
	var $showPatient = $('#show_patient');
	// Call function that loads the masks
	loadMasks();
	// Patient show
	$showPatient.on('ajax:success', function(e, data) {
		loadAjax(data, '.main', 'main');
	});	
	// Patient search by AJAX
	$findPatient.on('ajax:success', function(e, data) {		
		loadAjax(data, '#grid_patient', '#grid_patient');
		$('#search_name').val('');
	});
	// Patient new by AJAX
	$patient.on('ajax:success', function(e, data) {																
		loadAjax(data, '#_patient_msg', '#_patient_msg');		
	});
	// Patient edit by AJAX
	$editPatient.on('ajax:success', function(e, data) {											
		loadAjax(data, '#_patient_msg', '#_patient_msg');		
	});
	 
	// Function to change the layout 
	function loadAjax(_data, _find, _append) {
		var content = $(_data).find(_find);						
    	$(_append).empty().append(content);
	}
});
// Load masks into input form 
function loadMasks() {
	$('#patient_birth').inputmask('99/99/9999');
	$('#patient_telephone').inputmask('(99) 9999-9999');
	$('#patient_cellphone').inputmask('(99) 9999[9]-9999');	
}