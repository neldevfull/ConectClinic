var patientsAll = null;
// Get All Patients
function getPatients() {
	$.get('patients/patients', function(patients) {	
		patientsAll = patients.patients;								
	});
}
// Change the layout 
function loadAjax(_data, _find, _append) {
	var content = $(_data).find(_find);						
	$(_append).empty().append(content);
}
// Change the layout 
function loadAjax(_data, _find, _append) {
	var content = $(_data).find(_find);						
	$(_append).empty().append(content);
}
// Call Get Patients
getPatients();