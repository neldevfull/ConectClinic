// Request for get all Users
modulejs.define('getAllUsers', function() {
	return {
		execute: function() {
			return $.get('allusers');
		}
	} 
});

// Request for get all Healtcare
modulejs.define('getAllHealthcare', function() {
	return {
		execute: function() {
			return $.get('allhealthcare');
		}
	}
});

// Request for get all Answers
modulejs.define('getAnswers', function() {
	return {
		execute: function() {			
			return $.get('answers');
		}
	} 
});

// Request for get all Patients
modulejs.define('getAllPatients', function() {
	return {
		execute: function(resource) {
			return $.get(
				'allpatients/' + resource);		
		}
	} 
});

// Request for get all Insurances
modulejs.define('getAllInsurances', function() {
	return {
		execute: function() { 
			return $.get('allinsurances');
		}
	}
});

// Request for get all Insurances
modulejs.define('getAllInsurancesToConsults', function() {
	return {
		execute: function() { 
			return $.get('insurances/insurances');
		}
	}
});