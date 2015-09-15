$(function(){	 	
	var $patient        = $('.new_patient');
	var $editPatient   = $('.edit_patient');
	var $findPatient   = $('#find_patient'); 
	var $linkPatient   = $('#link_patient');
	// var $filter_patient = $('#filter_patient'); 

	// $filter_patient.bind('ajax:success', function(e, data) {	
	// 	alert('chegou');	
	// 	loadAjax(data, '#grid_patient', '#grid_patient')
	// });
	
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
	
	$linkPatient.on('ajax:success', function(e, data) {						
		loadAjax(data, '.main', 'main'); 		
	}); 

	// Function to change the layout 
	function loadAjax(_data, _find, _append) {
		var content = $(_data).find(_find);						
    	$(_append).empty().append(content);
	}

	// var $linkPatient = $('#link_patient');
	// var $newPatient  = $('#_new_patient');

	// $patient.on('ajax:before', function(obj) {
	// 	console.log(obj);
	// });

	// $newPatient.on('ajax:success', function(e, data) {		
	// 	alert('funcao para cadastrar');
	// 	loadAjax(data, "._main", "main");		
	// });

	// $patient.on('ajax:beforeSend', function(obj) {
	// 	console.log(obj);
	// });

	// $review.on('ajax.error', function() {
	// 	alert('nao rolou');
	// 	// $('.alert-danger').append('Erro Paciente:');
	// });

});