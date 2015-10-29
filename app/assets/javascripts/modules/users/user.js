modulejs.define('user', ['getAllHealthcare', 'getAnswers'], 
	function(getAllHealthcare, getAnswers) {
	return function() {		
		// All healthcare
		var healthcare = [];

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
			domain: function() {
				return window.location.href.toString()
					.split(window.location.host + '/')[1];
			},
			mainAnswers: function(_this) {
				var $healthcare = $('#healthcare_list');
				var $answers    = $('#healthcare_selected');

				_this.addRemoveAnswers(
					_this, $healthcare, $answers);

				if(_this.domain() !== "user"){					
					_this.answersList(
						_this, $answers);
				}

				_this.healtcareList(
					_this, $healthcare);								
			},
			answersList: function(_this, $answers) {
				promises = getAnswers.execute();
				promises.done(function(answers) {
					answers = answers.response;					
					_this.renderAnswers(
						_this, $answers, answers);
				});
				promises.fail(function(error) {
					console.log(error);
				}); 
			},
			healtcareList: function(_this, $healthcare) {	
				promises = getAllHealthcare.execute();			
				promises.done(function(healthcare) {
					healthcare = healthcare.response;					
					_this.renderHealthcare(
						_this, $healthcare, healthcare);					
				});
				promises.fail(function(error) {
					console.log(error);
				});
			},
			addRemoveAnswers: function(_this, $healthcare, $answers) {
				// Answers
				var answers = [];
				var removers = [];

				// Click to selected healthcare
				$healthcare.on('click', '.healthList', function() {
				    var li   = $(this).closest('li');
				    var name = _this.getName(li.html());
					var id   = li.attr('id');
								    
				    li.remove();				    
				    $answers.append(
				    	'<li id = "' + id + '"' +
				    	'class="_leftarrow _healthcare">' +
				    	'<span class="healthSelected">' + 
				    	name + 
				    	'</span></li>');
				    
				    answers.push(id);
				    $('#answers').val(answers);
				    console.log(answers);
				  
				    var remx = removers.indexOf(id);
					removers.splice(remx, 1);
					$('#removers').val(removers);
					console.log(removers);
				});

				// Click to deselected healthcare
				$answers.on('click', '.healthSelected', function() {
					var li   = $(this).closest('li');
					var name = _this.getName(li.html());
					var id   = li.attr('id');					
					
					li.remove();					
					$healthcare.append(
						'<li id = "' + id + '"' +
						'class="_rightarrow _healthcare">' +
						'<span class="healthList">' +
						name + 
						'</span></li>');					
					
					var index = answers.indexOf(id);
					answers.splice(index, 1);
					$('#answers').val(answers);
					console.log(answers);

					removers.push(id);
				    $('#removers').val(removers);
				    console.log(removers);

				});

			},
			renderAnswers: function(_this, $answers, objs) {
				// Render Healthcare selected
				content = 
					'<li class="_healthcare-title">' + 
						'Profissionais selecionados' +
					'</li>'
				objs.forEach(function(obj) {
					content +=
						'<li id = "' + obj.id + '"' +
						'class="_leftarrow _healthcare">' +
						'<span class = "healthSelected">' +
						obj.name +
						'</span></li>';
				});
				$answers.empty()
					.append(content);
			},
			renderHealthcare: function(_this, $healthcare, objs) {		
				// Render healthcare list		
				var content = 
					'<li class = "_healthcare-title">'+
					'Profissionais da saude</li>';

				// Render Healthcare list				
				objs.forEach(function(obj) {					
					content +=
						'<li id = "' + obj.id + '"' +
						'class = "_rightarrow _healthcare">' +
						'<span class="healthList">' +
						obj.name + '</span>' +
						'</li>';
				});
				$healthcare.empty()
					.append(content);	

				_this.renderHeight(_this);	
			},
			renderHeight: function(_this) {
				var $healthcare = $('#healthcare_list');
				var $answers    = $('#healthcare_selected');
				var aHeight     = $answers.height();
				var hHeight     = $healthcare.height();
				var height      = aHeight + hHeight;

				_this.renderHealthcareHeight(
					$healthcare, height);
				_this.renderAnswersHeight(
					$answers, height)
			},
			renderHealthcareHeight: function($healthcare, height) {
				$healthcare.css('height', height);
			},
			renderAnswersHeight: function($answers, height) {
				$answers.css('height', height);
			},
			getName: function(li) {
				var sName = li.split(">")[1];
				return sName.split("<")[0];
			},
			noneAnswers: function() {
				$('#container_answers')
					.css('display', 'none');
			}
		};
		// jQuery Exec
		$(function() {
			// Vars
			var $user        = $('#new_user');			
			var $user_career = $('#user_career'); 

			// Initialize
			if($user_career.val() === "healthcare")
				userForm.noneAnswers();
			else
				userForm.mainAnswers(userForm);			

			// New User
			$user.on('ajax:complete', function(jEvent, data) {
				if(data.responseJSON.fail === false){
					$('#output_message').removeClass('alert alert-warning alert-danger');
					$('#output_message').addClass('alert alert-success');
					$('#output_message').empty().append(data.responseJSON.response);
					if(data.responseJSON.verb === 'post') {
						userForm.cleanFields();
						userForm.renderHealthcare(healthcare);
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