modulejs.define('insurance', function() {
	return function() {		
		// jQuery
		$(function() {
			// Vars
			var $insurance = $('.new_insurance');
			
			// New Insurance			
			$insurance.on('ajax:complete', function(jEvent, data){
				console.log(data.responseJSON);
				if(data.responseJSON.error === false){
					$('#output_message').removeClass('alert alert-warning alert-danger');
					$('#output_message').addClass('alert alert-success');
					$('#output_message').empty().append(data.responseJSON.response);
				}
				else if(data.responseJSON.error === true) {
					$('#output_message').removeClass('alert alert-warning alert-success');
					$('#output_message').addClass('alert alert-danger');
					$('#output_message').empty().append('Erro ao Salvar Convenio: ' + data.responseJSON.response);
				}
				else {
					console.log('IMPLEMENT LOG');
				}
			});
			$insurance.on('ajax:error', function(error){
				console.log(error);
			});
		});
	}
});