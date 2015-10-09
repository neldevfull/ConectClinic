var resource = window.location.href.toString().split(window.location.host + '/')[1];
if(resource === '') {
	// Patients Pages
	function __patientsPages() {		
		var patientsPages = {
			pages: []
		};
		return patientsPages;
	}
	// Build Patients Page
	var patientsPages = __patientsPages(); 
	// Amount Pages
	var amountPages;	
	// jQuery Events
	$(function() {  	
		var $findPatient = $('#find_patient'); 
		// Call function get amout Patients and pagination
		getPatientsAmount();
		// Patient search by AJAX
		$findPatient.on('ajax:success', function(e, data) {		
			loadAjax(data, '#grid_patient', '#grid_patient');
			$('#search_name').val('');
		});
		// Search Patients
		$('#btn_search_patients').click(function() {
			var value         = $('#search_patients');
			var selectSearch  = $('#select_search');			
			if(value.val() != '')
				searchPatients(value, selectSearch);
			else {
				pagination(amountPages, 1);
				contentPatients(getFirstTwelve());
			}
		});		
	});
	// Get Patients Counter
	function getPatientsAmount() {
		$.get('patients/amount', function(count) {	
			amountPages = count.amount 	
			pagination(amountPages, 1);
		});
	}
	// Get First Twelve
	function getFirstTwelve() {
		var firstTwelve = [];
		for(var i = 0; i < 12; i++) {
			firstTwelve.push(patientsAll[i]);
		}
		patientsPages = __patientsPages();
		setPatientsPages(firstTwelve, 1);
		return firstTwelve;
	}
	// Search Patients
	function searchPatients(value, selectSearch) {
		var keys          = ['name', 'email', 'telephone'];
		var patientsFound = [];
		var length;   
		// Check key and find Patient
		keys.forEach(function(key) {	
			if(selectSearch.val() === key){
				patientsFound = findPatient(key, value);		
				return false;
			}
		});
		// Check Patients found and finish
		length = patientsFound.length;
		if(length > 0) {			
			storePatientFound(patientsFound, length);
			value.val('');
		}
	}
	// Store Patient found
	function storePatientFound(patientsFound, items) {		
		var pageNumber  = 1;
		var patients    = [];
		var firstTwelve = [];
		for(var i = 1; i <= items; i++) {
			patients.push(patientsFound[i - 1]);
			if(i === 12 || (items < 12 && items === i)) {
				firstTwelve = patients;
			}
			if(i === (pageNumber * 12) || items === i) {
				setPatientsPages(patients, pageNumber);
				patients = [];
				pageNumber++;				
			}
		}
		pagination(items, 1);
		contentPatients(firstTwelve);
	}
	// Find Patient
	function findPatient(key, value) {
		var patientsFound = [];
		var newValue;
		if(key === 'name') {
			newValue = new RegExp(
				'^' + value.val(), 'i'); 
		}
		else {
			newValue = new RegExp(value.val(), 'i');	
		}
		$.grep(patientsAll, function(patient) {
			if(newValue.test(patient[key]))
				patientsFound.push(patient);	        
	    });

		return patientsFound;
	}
	// Content Patients
	function contentPatients(patients) {	
		var contentPatient = '';
		patients.forEach(function(patient) {
			contentPatient +=
			'<tr>' +
			'<th><a href="patients/' + patient.id + '/edit">' + 
				patient.name + '</th>' +
			'<th>' + patient.email + '</th>' + 
			'<th>' + patient.telephone + '</th>' +		
			'<th>-----</th>' +							
			'<th>-----</th>' +
			'</tr>';
		});
		$('#content_patients').empty().append(contentPatient);
	}
	// Calc Items
	function calcItems(amount) {
		return Math.ceil(amount / 12); 
	}
	// Pagination
	function pagination(itemsP, itemsOnPage) {
		items = calcItems(itemsP);
		$('.simple_pagination').pagination({
	        items: items,
	        itemsOnPage: itemsOnPage,
	        cssStyle: 'light-theme',
	        prevText: 'Anterior',
	        nextText: 'Próximo',
	        onPageClick: function(pageNumber) { 
	        	var found    = false;
	        	var patients = [];
	        	patientsPages.pages.forEach(function(page) {
	        		if(page.number === pageNumber) {
	        			patients = page.patients;
	        			found = true;
	        			return false;
	        		}
	        	});
	        	if(found === true) {        		
	        		contentPatients(patients);
	        	}	
	        	else {
		        	var offset = (pageNumber - 1) * 12;
		        	getPatientsToPagination(offset, pageNumber);
	        	}       	 
	        }
	    });
	 }
	// Get Patients
	function getPatientsToPagination(offset, pageNumber) {
		$.get('patients/main/12/'+offset, function(patients) {	
			if(patients.error === false) {											
				if(patients.patients.length > 0) {
					// Set Patients Pages
					setPatientsPages(patients.patients, pageNumber);
					// Builds Grid Patients
					contentPatients(patients.patients);
				}
				else {
					$('#no_patients').css('display', 'block');
					$('#grid_patient').css('display', 'none');
				}
			}
			else if(patients.error === true) {
				console.log('Erro ao buscar pacientes');
			}
		});
	}
	// Set Patients Pages
	function setPatientsPages(patients, pageNumber) {					
		var page = {};
		page.number   = pageNumber;
		page.patients = patients;				
		patientsPages.pages.push(page); 
	}	
}