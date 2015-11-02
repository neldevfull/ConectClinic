modulejs.define('user', ['getAllHealthcare', 'getAnswers'],   
	function(getAllHealthcare, getAnswers) {
	return function() {	

		// All healthcare
		var healthcare = [];

		// Form
		var userForm = {
			// Attributes
			height: 0,
			answers: [],
			removers: [],
			$healthcare: $('#healthcare_list'),
			$answers: $('#healthcare_selected'),
			$userAnswers: $('#user_answers'),
			$userRemovers: $('#user_removers'),
			// Methods
			cleanFields: function() {
				$('#user_name').val('');
				$('#user_email').val('');
				this.cleanPassw();
				$('#user_privilege').removeAttr('checked');
				$("input:radio").attr("checked", false);
				$('#user_career').val('career');
			},
			cleanPassw: function() {
				$('#user_password').val('');
				$('#user_password_confirmation').val('');				
			},
			cleanProperties: function(_this) {
				_this.height   = 0;
				_this.answers  = [];
				_this.removers = []; 
				_this.$userAnswers.val('');
				_this.$userRemovers.val('');
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
				promises.done(function(result) {
					answers = result.response;					
					_this.renderAnswers(_this, answers);
				});
				promises.fail(function(error) {
					console.log(error);
				}); 
			},
			healtcareList: function(_this) {	
				promises = getAllHealthcare.execute();			
				promises.done(function(result) {
					healthcare = result.response;					
					_this.renderHealthcare(_this, healthcare);					
				});
				promises.fail(function(error) {
					console.log(error);
				});
			},
			addRemoveAnswers: function(_this) {
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
				    
				    _this.answers.push(id);
				    _this.$userAnswers.val(_this.answers);
				  
				    var remx = _this.removers.indexOf(id);
					_this.removers.splice(remx, 1);
					_this.$userRemovers.val(_this.removers);
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
					
					var index = _this.answers.indexOf(id);
					_this.answers.splice(index, 1);
					_this.$userAnswers.val(_this.answers);					

					_this.removers.push(id);
				    _this.$userRemovers.val(_this.removers);		
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
					_this.height += 42;

				_this.$healthcare.css('height', _this.height + 32);
				_this.$answers.css('height', _this.height + 32);
			},
			getName: function(li) {
				var sName = li.split(">")[1];
				return sName.split("<")[0];
			},
			noneAnswers: function() {
				$('#container_answers')
					.css('display', 'none');
			},
			successfully: function(_this) {
				_this.cleanProperties(_this);
				_this.healtcareList(_this);
				_this.renderAnswers(_this, undefined);
			},
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
						userForm.successfully(userForm);
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