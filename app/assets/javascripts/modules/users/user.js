modulejs.define('user', ['getAllHealthcare', 'getAnswers'], 
	function(getAllHealthcare, getAnswers) {
	return function() {		
		// All healthcare
		var healthcare = [];

		// Form
		var userForm = {
			// Attributes
			height: 0,
			$healthcare: $('#healthcare_list'),
			$answers: $('#healthcare_selected'),
			$div_answers: $('#user_answers'),
			$div_removers: $('#user_removers'),
			// Methods
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
				_this.addRemoveAnswers(_this);

				if(_this.domain() !== "user"){					
					_this.answersList(_this);
				}

				_this.healtcareList(_this);								
			},
			answersList: function(_this) {
				promises = getAnswers.execute();
				promises.done(function(answers) {
					answers = answers.response;					
					_this.renderAnswers(_this, answers);
				});
				promises.fail(function(error) {
					console.log(error);
				}); 
			},
			healtcareList: function(_this) {	
				promises = getAllHealthcare.execute();			
				promises.done(function(healthcare) {
					healthcare = healthcare.response;					
					_this.renderHealthcare(_this, healthcare);					
				});
				promises.fail(function(error) {
					console.log(error);
				});
			},
			addRemoveAnswers: function(_this) {
				// Answers
				var answers = [];
				var removers = [];

				// Click to selected healthcare
				_this.$healthcare.on('click', '.healthList', function() {
				    var li   = $(this).closest('li');
				    var name = _this.getName(li.html());
					var id   = li.attr('id');
								    
				    li.remove();				    
				    _this.$answers.append(
				    	'<li id = "' + id + '"' +
				    	'class="_leftarrow _healthcare">' +
				    	'<span class="healthSelected">' + 
				    	name + 
				    	'</span></li>');
				    
				    answers.push(id);
				    _this.$div_answers.val(answers);
				    console.log(_this.$div_answers.val());
				  
				    var remx = removers.indexOf(id);
					removers.splice(remx, 1);
					_this.$div_removers.val(removers);
					console.log(_this.$div_removers.val());

				});

				// Click to deselected healthcare
				_this.$answers.on('click', '.healthSelected', function() {
					var li   = $(this).closest('li');
					var name = _this.getName(li.html());
					var id   = li.attr('id');					
					
					li.remove();					
					_this.$healthcare.append(
						'<li id = "' + id + '"' +
						'class="_rightarrow _healthcare">' +
						'<span class="healthList">' +
						name + 
						'</span></li>');					
					
					var index = answers.indexOf(id);
					answers.splice(index, 1);
					_this.$div_answers.val(answers);	
					console.log(_this.$div_answers.val());				

					removers.push(id);
				    _this.$div_removers.val(removers);				  
				    console.log(_this.$div_removers.val());

				});

			},
			renderAnswers: function(_this, objs) {
				// Render Healthcare selected
				height = 0;
				content = 
					'<li class="_healthcare-title">' + 
						'Profissionais selecionados' +
					'</li>';

				if(objs !== undefined) {					
					objs.forEach(function(obj) {
						content +=
							'<li id = "' + obj.id + '"' +
							'class="_leftarrow _healthcare">' +
							'<span class = "healthSelected">' +
							obj.name +
							'</span></li>';
							height++;
					});
				}
				_this.$answers.empty()
					.append(content);

				_this.renderHeight(_this, height);
			},
			renderHealthcare: function(_this, objs) {		
				// Render healthcare list
				height = 0;		
				var content = 
					'<li class = "_healthcare-title">'+
					'Profissionais da saude</li>';

				if(objs !== undefined){					
					objs.forEach(function(obj) {					
						content +=
							'<li id = "' + obj.id + '"' +
							'class = "_rightarrow _healthcare">' +
							'<span class="healthList">' +
							obj.name + '</span>' +
							'</li>';
							height++;
					});
				}
				if(_this.$healthcare !== undefined){					
					_this.$healthcare.empty()
						.append(content);	
				
					_this.renderHeight(_this, height);	
				}				
			},
			renderHeight: function(_this, height) {
				for(var i = 0; i < height; i++)
					_this.height += 70;

				_this.$healthcare.css('height', _this.height);
				_this.$answers.css('height', _this.height);
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