modulejs.define('insurances', ['getAllInsurances'],
	function(getAllInsurances) {
	return function() {	
		
		// Objects
		var allObjs = {
			entity: 'insurances',  
			objs: ''
		};
		var pagination;

		// Promise for all Insurances
		getAllInsurances.done(function(insurances) {
			allObjs.objs   = insurances.response
			// Pagination
			pagination = modulejs.require('pagination', { allObjs: allObjs });	
			pagination.startPagination(); 	
		});
		getAllInsurances.error(function(error) {
			console.log(error);
		});

		// jQuery
		$(function() { 
			// Search Insurances
			$('#btn_search_insurances').click(function() {
				var value         = $('#search_insurances');
				var selectSearch  = $('#select_search');			
				if(value.val() != '')
					pagination.search(
						['identifier', 'name', 'city',
							'state'],value, selectSearch);
				else {
					pagination.mountPage(allObjs.objs.length, pagination.getFirst());
				}
			});
			// Filter Insurances
			$('#filter_insurances').change(function() {
				selectOption = $('#filter_patients option:selected');
				pagination.filter(selectOption);
			});	
		});
	}
});		