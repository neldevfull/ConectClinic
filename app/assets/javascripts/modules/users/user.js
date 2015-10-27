modulejs.define('user', ['getAllHealthcare'],
	function(getAllHealthcare) {
	return function() {
		// Objects
		var allObjs = {
			entity: 'users',
			objs: ''
		};

		// Form
		var userForm = {
			cleanFields: function() {
				$('#user_name').val('');
				$('#user_email').val('');
				this.cleanPassw();
				$('#user_privilege').removeAttr('checked');
				$("input:radio").attr("checked", false);
			},
			cleanPassw: function() {
				$('#user_password').val('');
				$('#user_password_confirmation').val('');				
			},
			healtcareList: function(_this, $healthcare, $hSelected) {
				getAllHealthcare.done(function(healthcare) {
					allObjs.objs = healthcare.response;
					_this.answers(_this, $healthcare, $hSelected);
				});
				getAllHealthcare.fail(function(error) {
					console.log(error);
				});
			},
			answers: function(_this, $healthcare, $hSelected) {
				var answers     = [];

				_this.renderAnswers($healthcare, $hSelected);
				
				// Click to selected healthcare
				$('#healthcare_list').on('click', '.healthList', function() {
				    var li   = $(this).closest('li');
				    var name = _this.getName(li.html());
					var id   = li.attr('id');
								    
				    li.remove();				    
				    $('#healthcare_selected').append(
				    	'<li id = "' + id + '"' +
				    	'class="_leftarrow _healthcare">' +
				    	'<span class="healthSelected">' + 
				    	name + 
				    	'</span></li>');
				    answers.push(id);
				    $('#answers').val(answers);
				});

				// Click to deselected healthcare
				$('#healthcare_selected').on('click', '.healthSelected', function() {
					var li   = $(this).closest('li');
					var name = _this.getName(li.html());
					var id   = li.attr('id');					
					
					li.remove();					
					$('#healthcare_list').append(
						'<li class="_rightarrow _healthcare">' +
						'<span class="healthList">' +
						name + 
						'</span></li>');					
					answers.splice(answers.indexOf(id), 1);
					$('#answers').val(answers);
				});

			},
			renderAnswers: function($healthcare, $hSelected) {
				var height  = 0;
				var content = 
					'<li class = "_healthcare-title">'+
					'Profissionais da saude</li>';

				// Render Healthcare list				
				allObjs.objs.forEach(function(obj) {					
					content +=
						'<li id = "' + obj.id + '"' +
						'class = "_rightarrow _healthcare">' +
						'<span class="healthList">' +
						obj.name + '</span>' +
						'</li>';
				});
				$healthcare.empty()
					.append(content);

				// Render Healthcare selected
				content = 
					'<li class="_healthcare-title">' + 
						'Profissionais selecionados' +
					'</li>'
				$hSelected.empty()
					.append(content);

				// Set height
				$healthcare.css('height', $healthcare.height());
				$hSelected.css('height', $healthcare.height());				
			},
			getName: function(li) {
				var sName = li.split(">")[1];
				return sName.split("<")[0];
			}
		};
		// jQuery Exec
		$(function() {
			// Vars
			var $user       = $('#new_user');
			var $healthcare = $('#healthcare_list'); 
			var $hSelected  = $('#healthcare_selected');

			// Initialize 
			userForm.healtcareList(userForm, $healthcare, $hSelected);

			// New User
			$user.on('ajax:complete', function(jEvent, data) {
				if(data.responseJSON.fail === false){
					$('#output_message').removeClass('alert alert-warning alert-danger');
					$('#output_message').addClass('alert alert-success');
					$('#output_message').empty().append(data.responseJSON.response);
					if(data.responseJSON.verb === 'post') {
						userForm.cleanFields();
						userForm.renderAnswers(
							$healthcare, $hSelected);
					}
					else if(data.responseJSON.verb === 'put')
						userForm.cleanPassw();

				}
				else if(data.responseJSON.fail === true) {
					$('#output_message').removeClass('alert alert-warning alert-success');
					$('#output_message').addClass('alert alert-danger');
					$('#output_message').empty().append('Erro ao Salvar Usuario: ' + data.responseJSON.response);
					userForm.cleanPassw();
				}
				else {
					console.log('IMPLEMENT LOG');
				}
			});
			$user.on('ajax:error', function(error) {
				console.log(error);
			});
		});
	}
});