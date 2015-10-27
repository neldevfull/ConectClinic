// Request for get all Users
modulejs.define('getAllUsers', function() {
	return $.get('allusers');
});

// Request for get all Healtcare
modulejs.define('getAllHealthcare', function() {
	return $.get('allhealthcare');
});

// Request for get all Patients
modulejs.define('getPatientsAll', function() {
	return $.get('patients/patients');
});

// Request for get all Insurances
modulejs.define('getAllInsurances', function() {
	return $.get('allinsurances');
});