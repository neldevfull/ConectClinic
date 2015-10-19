// Request for get all Patients
modulejs.define('getPatientsAll', function() {
	return $.get('patients/patients');
});

// Request for get all Insurances
modulejs.define('getAllInsurances', function() {
	return $.get('allinsurances');
});