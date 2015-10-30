modulejs.define('login', function() {
		return function() {
			// jQuery
			$(function() {
				// Vars
				var $login = $('#new_user_session');
				
				// New Insurance			
				$login.on('ajax:complete', function(jEvent, data){				
					if(data.responseJSON.fail === false) {	
						console.log(data.responseJSON.response);					
						// var domain = window.location.href.toString()
						// 	.split(window.location.host + '/')[0];	
						// window.location.href = domain + window.location.host;  
					}
					else if(data.responseJSON.fail === true) {						
						$('#output_message_login').addClass('alert alert-danger');
						$('#output_message_login').css('display', 'block');
						$('#output_message_login').empty().append(data.responseJSON.response);
					}
					else {
						console.log('IMPLEMENT LOG');
					}
				});
				$login.on('ajax:error', function(error){
					console.log(error);
				});
			});
		}
	});