modulejs.define('getPatientsAll', function() {
	return $.get('patients/patients');
});