modulejs.define('consults', ['validationsForm', 'getPatientsAll', 'getAllInsurances'],  
	function(validationForm, getPatientsAll, getAllInsurances) {
	return function() {
		// Get Patients All
		var patientsAll = [];
		getPatientsAll.done(function(patients) {
			patientsAll = patients.patients;
		});
		getPatientsAll.fail(function(error) {
			console.log(error);			
		});

		// All Insurances
		var allInsurances = [];
		getAllInsurances.done(function(insurances) {
			allInsurances = insurances.response;
			// Mount select of insurances
			consultForm.selectInsurances(allInsurances);
		});
		getAllInsurances.fail(function(error) {
			console.log(error);
		});

		// Initialize objects and vars
		var consultForm = {
			// Validate Fields
			validate: function() {
				var messages = [];
				$name        = $('#name').val();
				$email       = $('#email').val();
				$telephone   = $('#telephone').val();
				$cellphone   = $('#cellphone').val();
				$insurances  = $('#insurance_other').val();
				$date        = $('#date').val();
				$hourIni     = $('#hour_ini').val();
				$hourEnd     = $('#hour_end').val();
				$genderName  = $('input[name="gender"]');
				$genderId	 = 'gender';
				$mailAccept  = 'mail_accept';
				// Call Validation
				addMessage(validationForm.fullName($name));
				addMessage(validationForm.email($email));
				addMessage(validationForm.telephones(
					$telephone, $cellphone));
				addMessage(validationForm.date(
					$date, true));
				addMessage(validationForm.hourly(
					$hourIni, $hourEnd));
				addMessage(validationForm.gender(
					$genderName, $genderId));
				addMessage(validationForm.mailAccept(
					$mailAccept, $email));
				addMessage(validationForm.alphanumeric(
					$insurances, 'Nome do Convenio', 3));

				if(messages.length > 0) {
					var msg;
					for(var i = 0; i < messages.length; i++) {
						if(i !== 0)
							msg += ', ' + messages[i];
						else 					
							msg = messages[i];				
					}
					this.message(msg, 0);
					return false;	
				}
				else 	
					return true;
				// Check if message is empty
				function addMessage(message) {
					if(message !== true) 
						messages.push(message);
				}
			},
			// Output Message
			message: function(message, option) {
				switch(option) {
					case 0:
						$('#error_message').removeClass('alert alert-warning');
						$('#error_message').addClass('alert alert-danger');
						$('#error_message').empty().append(message);	
					break;

					case 1:
						$('#error_message').removeClass('alert alert-danger');
						$('#error_message').addClass('alert alert-warning');
						$('#error_message').empty().append(message);
					break;

					default: break;	
				}
			},
			// Load fields
			loadFields: function(consult) {
				$('#name').val(consult.name);
				$('#email').val(consult.email);
				$('#telephone').val(consult.telephone);
				$('#cellphone').val(consult.cellphone);
				$('#gender_'+consult.gender).prop('checked', true);
				$('#insurances').val(consult.insurance_id);
				$('#insurances').val(consult.insurance_id);
				$('#date').val(consultUtil.parseDate(consult.date, '-','/'));
				$('#hour_ini').val(consult.hour_ini);
				$('#hour_end').val(consult.hour_end);
				$('#mail_accept')
					.prop('checked', consult.mail_accept);
				var confirm = consult.confirm !== 0 &&
					consult.confirm !== 2 ? true : false;
				$('#confirm').prop('checked', confirm);										
			},
			// Load masks into input form 
			loadMasksConsults: function() {
				$('#date').inputmask('99/99/9999');
				$('#telephone').inputmask('(99) 9999-9999');
				$('#cellphone').inputmask('(99) 99999-9999');
				$('#hour_ini').inputmask('99:99');
				$('#hour_end').inputmask('99:99'); 
			},
			// Prepare fields of the New Form
			preparedFields: function(start, end) {	
				var hourIni    = start != '' ?
					consultUtil.parseMomentToHour(start) : '';
				var hourEnd    = end != '' ?
					consultUtil.parseMomentToHour(end) : '';	
				var date       = start != '' ? 
					consultUtil.parseMomentToDate(start) : '';
				var dateFormat = date != '' ?
					consultUtil.parseDate(date, '-', '/') : '';  

				$('#name').val('');
				$('#email').val('');
				$('#telephone').val('');
				$('#cellphone').val('');
				$('#gender_male').prop('checked', false);
				$('#insurances').val(0);
				$('#gender_female').prop('checked', false);
				$('#date').val(dateFormat); 	
				$('#hour_ini').val(hourIni);
				$('#hour_end').val(hourEnd);
				$('#mail_accept').prop('checked', false);
				$('#confirm').prop('checked', false);
			},
			// Mount select for insurances
			selectInsurances: function(allInsurances) {
				console.log(allInsurances);
				var insurances = $('#insurances');
				insurances.append($('<option>', {
					value: 0,
					text:  'Particular'
				}));
				allInsurances.forEach(function(insurance) {
				    $('#insurances').append($('<option>', { 
				        value: insurance.id,
				        text : insurance.name + 
				        	' - ' + insurance.identifier 
				    }));
				});
				insurances.append($('<option>', {
					value: 'other',
					text:  'Outro'
				}));
			},
			// Other Insurance
			otherInsurance: function() {
				var insurances     = $('#insurances');
				var insuranceOther = $('#insurance_other');
				insurances.change(function() {
					if(insurances.val() === 'other')
						insuranceOther.css('display', 'block');					
					else
						insuranceOther.css('display', 'none');
				});
			}
		};
		var _consults = {
			weeks: [
				{
					start: '',
					end: ''
				}
			],
			events: []	
		};	
		var _event;
		var _consult;
		var _view    = 'week';
		var _control = 0;
		var checkAutoComplete = false;
		// jQuery run
		$(function() { 			
			// Call function that load the calendar
			fullCalendar();									 		
			// WeekDates and Recovers Consults
			weekDates();
			// Call function that load event buttons
			eventButtons();		
			// Call function that loads the masks
			consultForm.loadMasksConsults();
			// Call other insurances			
			consultForm.otherInsurance();
		});
		// Get Patients Names
		function loadAutoComplete() {	
			var name  = $('#name');
			var email = $('#email'); 	
	 		var names = []; 		
			var _patients = patientsAll;
			// Load names
			_patients.forEach(function(patient) {			
				names.push(patient.name);
			});
			name.autocomplete({
		    	source: function(request, response) {
		    		var matcher = new RegExp('^' +
		    			$.ui.autocomplete.escapeRegex(
		    				request.term), 'i');
		    		response($.grep(names, function(name) {
		    			return matcher.test(name);
		    		}));
		    	}, 
		    	minLength: 3
		    });
			// Check patient and data is recovered
			email.focus(function() {
				_patients.forEach(function(patient) {
					if(patient.name == name.val()) {
						email.val(patient.email); 
						$('#telephone').val(patient.telephone);
						$('#cellphone').val(patient.cellphone);
						$('#gender_'+ patient.gender)
							.prop('checked', true);
						$('#mail_accept')
							.prop('checked', patient.mail_accept);
					}	 	 
				});
			});
		} 
		// Function responsible for load event buttons
		function eventButtons() {			
			$('.fc-next-button').click(function() {	
				loadCalendar();
		    }); 

			$('.fc-prev-button').click(function() {
				loadCalendar();
			});

			$('.fc-agendaWeek-button').click(function() {
				if(_view !== 'week') {					
					_view = 'week';
					loadCalendar();
				}
			});

			$('.fc-agendaDay-button').click(function() {
				if(_view !== 'day'){					
					_view = 'day';
					loadCalendar();
				}
			});

			$('#agenda_consulta').click(function() {
				consultForm.preparedFields('', '');
				_control = 1;
				_event = {
					title: '',
					start: '',
					end: '' 
				};
				// Open Dialog
				openDialog();
			});

		} 
		// Load Calendar
		function loadCalendar() {	
			switch(_view) {
				case 'week':
					weekDates();
				break;

				case 'day':
					dayWeekDates();
				break;

				default: break;
			}	
		}
		// Make dealings on day and loads consultations
		function dayWeekDates() {
			var view    = $('#calendar').fullCalendar('getView');	
			var weekDay = view.start.weekday(); 
			var weekStart;
			var weekEnd;	

			if(weekDay === 0){		
				weekStart = consultUtil.parseMomentToDate(view.start);
				weekEnd   = consultUtil.parseMomentToDate(view.end.add(3, 'day')); 	
				recoversConsults(weekStart, weekEnd);
			}	
			else if(weekDay === 4) {
				weekStart = consultUtil.parseMomentToDate(view.start.subtract(4, 'day'));
				weekEnd   = consultUtil.parseMomentToDate(view.end.subtract(1, 'day')); 
				recoversConsults(weekStart, weekEnd);
			}
		}
		// Make dealings on the dates and loads consultations
		function weekDates() {
			var view      = $('#calendar').fullCalendar('getView');
			var weekStart = consultUtil.parseMomentToDate(view.start);
			var weekEnd   = consultUtil.parseMomentToDate(view.end.subtract(1, 'day')); 
			
			recoversConsults(weekStart, weekEnd); 
		} 
		// Check if there is already week
		function checkWeek(_weekStart, _weekEnd) {
			var success = true;	
			_consults.weeks.forEach(function(week) {		
				if(_weekStart == week.start &&
					_weekEnd == week.end) {						
					success = false;
					return false;
				}
			});
			return success; 	
		}
		// Set Colors
		function setColors(confirm) {
			var color = {
				background: '',
				border: '',
			};
			switch(confirm) {
				case 0:
					color.background = '#FFBB3F';
					color.border     = '#FFA500';					
					return color;
				break;

				case 1:
					color.background = '#3F9F3F';
					color.border     = '#008000';
					return color;
				break;

				case 2:
					color.background = '#FF3F3F';
					color.border     = '#FF0000';
					return color;
				break;

				case 3:
					color.background = '#6BACC1';
					color.border     = '#3B91AD';
					return color;
				break;

				default: 
					color.background = 'gray';
					color.border     = 'gray';
					return color;
				break;
			}
		}
		// Function responsible for recovers data of the Consults 
		function recoversConsults(_weekStart, _weekEnd) {		
			if(checkWeek(_weekStart, _weekEnd)) {		
				$.ajax({
					type: 'GET',
					url: '/consults',
					data: 'weekStart=' + _weekStart +
						'&weekEnd=' + _weekEnd,
					success: function(consults) {							
						if(consults.length > 0){										
							consults.forEach(function(consult) {
								var find = false;
								_consults.events.forEach(function(_consult) {
									if(consult.id === _consult.id)
										find = true
								});
								if(find === false) {									
									// Check color and set
									var color = setColors(consult.confirm);																		
									var _event = {
										title: consult.name,
										start: consultUtil.parseDateToMoment(consult.date, consult.hour_ini),
										end:   consultUtil.parseDateToMoment(consult.date, consult.hour_end),
										color: color.background,
										borderColor: color.border				
									}				
									renderEvent(_event);	
									_consults.events.push(consult);					
								}	
							});	 				
							console.log('Consultas recuperadas com sucesso');			 												
						}
						else {
							console.log('Nao ha consultas agendadas para essa  semana');	
						}		
					},
					error: function(error) {
						console.log(error);
					}
			    });     			
				_consults.weeks.push(
					{
						start: _weekStart,
						end: _weekEnd
					}
				);
			}
		} 
		// Function responsible for FullCalendar and Dialog
		function fullCalendar() {
			var _start;
			var _end; 
			var _date;
			var _data;
			var _eventStart;
			var lang 	 = 'pt-br';
			var calendar = $('#calendar').fullCalendar({
				header: {
					left: 'title',
					center: 'prev, next today',
					right: 'agendaWeek, agendaDay'
				},
				defaultView: 'agendaWeek', 
				lang: lang,
				weekends: false,
				allDaySlot: false,
				slotDuration: '00:15:00',
				scrollTime: '08:00:00',
				timeFormat: 'H:mm',
				titleFormat: 'DD MMMM YYYY',		
				businessHours:
					{
						start: '8:00',
			    		end: '19:00'
			    	},
			    contentHeight: 460,
				selectable: true,
				selectHelper: true,		
				editable: true,			
				firstDay: 1,
				// Insert consultation			
				select: function(start, end) {	
					_start = start;
					_end   = end;			
					_control = 1;
					// Prepared Fields
					consultForm.preparedFields(start, end);					
					_event = {
						start: _start,
						end: _end,
					};					
					calendar.fullCalendar('unselect');
					// Open Dialog
					openDialog();
				}, 
				// Update consultation
				eventClick: function(event) {				 				
					_start = consultUtil.parseMomentToHour(event.start);
					_end   = consultUtil.parseMomentToHour(event.end); 
					_date  = consultUtil.parseMomentToDate(event.start); 
			        _control = 2;		
					// Find scheduled consult and carries fields 
					_consults.events.forEach(function(consult) {
						if(consult.name == event.title && 
							consult.hour_ini == _start &&
							consult.hour_end == _end &&
							consult.date == _date) {
							_consult = consult;
							consultForm.loadFields(consult);
							return false;										
						}
					});
			        _event = event;
			        // Open Dialog
			        openDialog();
			    },
			    // Event Drag n' Drop
			    eventDragStart: function(event) {
			    	_eventStart = eventStart(event);
			    },
			    eventDrop: function(event) { 
			    	_start = consultUtil.parseMomentToHour(event.start);
					_end   = consultUtil.parseMomentToHour(event.end); 
					_date  = consultUtil.parseMomentToDate(event.start); 
					// Find scheduled consult and update consult 
					_consults.events.forEach(function(consult) {
						if(consult.name == _eventStart.title &&
							consult.hour_ini == _eventStart.start && 
							consult.hour_end == _eventStart.end &&
							consult.date == _eventStart.date) { 
							_data = 'consult[date]=' + _date +
								'&consult[hour_ini]=' + _start +
								'&consult[hour_end]=' + _end + 
								'&consult[patient_id]=' +
								consult.patient_id +
								'&_method=put';										
							ajaxjQuery('POST', '/consults/' + consult.id,
								_data, 'eventDrop');						
							// Update into consult
							consult.date    = _date;
							consult.hour_ini = _start;
							consult.hour_end = _end;					
							return false;  										
						}
					});
			    },
			    // Event Resize
			    eventResizeStart: function(event) {
			    	_eventStart = eventStart(event);
			    },
			    eventResize: function(event) {
			    	_end  = consultUtil.parseMomentToHour(event.end); 			
			    	// Find scheduled consult and update consult 
					_consults.events.forEach(function(consult) {
						if(consult.name == _eventStart.title &&
							consult.hour_ini == _eventStart.start && 
							consult.hour_end == _eventStart.end &&
							consult.date == _eventStart.date) { 
							_data = 'consult[hour_end]=' + _end + 
								'&consult[patient_id]=' +
								consult.patient_id +
								'&_method=put';										
							ajaxjQuery('POST', '/consults/' + consult.id,
								_data, 'eventResize');						
							// Update into consult					
							consult.hour_end = _end;					
							return false;  										
						}
					});
			    }	
			}); 
		  	// Dialog 
			$('#dialog').dialog({
		        autoOpen: false,
		        height: 630,
		        width: 720,
		        modal: true,
		        closeOnEscape: false,       
		        open: function() {
		        	$('.ui-widget-overlay').addClass('custom-overlay');
		        },
		        buttons: [
		        	{
			        	text: 'Remover',
			        	open: function() {
			        		$(this).addClass('btn btn-danger');	         		     	        			        		
			        	},	        	
			        	click: function() {	        		
			                removeEvent(_event);
			                var data = 'consult[status]=' +
		            			0 + '&_method=put';
		            		ajaxjQuery('POST', '/consults/' + _consult.id, 
		            				data, 'put');
							consultForm.message('Confirmando...', 1);
			            }
		            },
		            {
		            	text: 'Finalizar',
		            	open: function() {            		
			        		$(this).addClass('btn btn-info');
		            	},
		            	click: function() { 		            		           	
		            		var data = 'consult[confirm]=' +
		            			3 + '&_method=put';
		            		ajaxjQuery('POST', '/consults/' + _consult.id, 
		            				data, 'put');
							consultForm.message('Confirmando...', 1);							
		            		// Set values to event
		            		var color          = setColors(3);
			            	_event.color       = color.background;
			            	_event.borderColor = color.border; 
		            	}
		            },		            
		            {
		            	text: 'Cancelar',
		            	open: function() {            		
			        		$(this).addClass('btn btn-warning');
		            	},
		            	click: function() {            	
		            		$(this).dialog('close');
		            	}
		            },            
		            {
		            	text: 'Agendar',
		            	open: function() {            		
			        		$(this).addClass('btn btn-success');
		            	},
		            	click: function() { 
		            		if(consultForm.validate()) {            			
			            		var data;
			            		var confirm = $('input[id="confirm"]:checked').length;
			            		var color   = setColors(confirm);
			            		// Set values to event
				            	_event.title       = $('#name').val();
				            	_event.color       = color.background;
				            	_event.borderColor = color.border;
				            	// Check Insurance
				            	var insurance = checkInsurance(); 
				            	// Insert
				            	if(_control == 1) {
									isChangeDate();   						 						
				            		data = 'patient[name]=' + $('#name').val() +
				            			'&patient[email]=' + $('#email').val() +
										'&patient[telephone]=' + $('#telephone').val() +
										'&patient[cellphone]=' + $('#cellphone').val() +
										'&consult[insurance_id]=' + insurance +
										'&consult[date]=' + 
										consultUtil.parseDate($('#date').val(), '/', '-') +
										'&consult[hour_ini]=' + $('#hour_ini').val() +
										'&consult[hour_end]=' + $('#hour_end').val() +
										'&patient[gender]=' +
										$('input[type="radio"][name="gender"]:checked').val() +
										'&patient[mail_accept]=' + 
										$('input[id="mail_accept"]:checked').length +
										'&consult[confirm]=' +
										$('input[id="confirm"]:checked').length +
										'&consult[scheduling]=' + $('#scheduling').val();
									ajaxjQuery('POST', '/consults', data, 'post');
									consultForm.message('Agendando...', 1);	 		            		            								 							            		 
				            	}
				            	// Update 
				            	else if(_control == 2) {	            			            			            		
				            		if((data = fieldUpdateConsult()) !== '') {           			
				        				ajaxjQuery('POST', '/consults/' + _consult.id,
				        					data, 'put');
				            		}
				            		else
				            			$('#dialog').dialog('close');	            		      				 		             
				            	}
		            		}
		            	}
		            }
		        ],
		        close: function () {
		        	$('.ui-widget-overlay').removeClass('custom-overlay');        	
		        }
		    });
		} 
		// Check Insurance
		function checkInsurance() {
			var other = $('#insurance_other');
			if(other.val() != '')
				return other.val();
			else
				return $('#insurances').val();
		}
		// Event start for Drag n' Drop and Resize
		function eventStart(_event) {	
			var start = consultUtil.parseMomentToHour(_event.start);
			var end   = consultUtil.parseMomentToHour(_event.end); 
			var date  = consultUtil.parseMomentToDate(_event.start); 
			var eventStart = {};
			eventStart = {
				title: _event.title,
				start: start,
				end: end,
				date: date
			}
			return eventStart;
		}
		// jQuery AJAX
		function ajaxjQuery(method, url, data, option) {
			$.ajax({
				type: method,
				url: url,
				data: data,
				success: function(data) {							
					if(data['error'] === false){				
						if(option === 'post'){
							renderEvent(_event);					
							insertConsult(data["response"]); 
						}
						else if(option === 'put') {
							updateEvent(_event);
							updateConsult();
						}								
						$('#dialog').dialog('close');	 											
					}
					else
						consultForm.message(data['response'], 0);														
				},
				error: function(error) {
					console.log(error);			
				}
		    });
		}
		// Update consultation 
		function updateConsult() {
			_consults.events.forEach(function(consult) {
				if(consult === _consult) {
					consult = _consult;
				}
			});
		}
		// Check each modified field and update 
		function fieldUpdateConsult() {
			var data       = '';
			var name       = $('#name').val();
			var email      = $('#email').val(); 
			var telephone  = $('#telephone').val();
			var cellphone  = $('#cellphone').val();
			var gender     = $('input[name="gender"]:checked').val();
			var date       = consultUtil.parseDate($('#date').val(), '/', '-');
			var hourIni    = $('#hour_ini').val();
			var hourEnd    = $('#hour_end').val();
			var mailAceept = $('input[id="mail_accept"]:checked').length;
			var confirm    = $('input[id="confirm"]:checked').length;

			if(_consult.name != name) {		
				data += 'patient[name]=' + name;
				_consult.name = name;
			} 
			if(_consult.email != email) {
				concat();
				data += 'patient[email]=' + email;
				_consult.email = email;
			}
			if(_consult.telephone != telephone) {
				concat();
				data += 'patient[telephone]=' + telephone;
				_consult.telephone = telephone;
			}
			if(_consult.cellphone != cellphone) {
				concat();
				data += 'patient[cellphone]=' + cellphone;
				_consult.cellphone = cellphone;
			}
			if(_consult.gender != gender) {
				concat();
				data += 'patient[gender]=' + gender;
				_consult.gender = gender;
			}
			if(_consult.date != date) {
				concat();		
				data += 'consult[date]=' + date; 
				_consult.date = date;		
				updateStart();
				updateEnd();
			}
			if(_consult.hour_ini != hourIni) {
				concat();
				data += 'consult[hour_ini]=' + hourIni;
				_consult.hour_ini = hourIni;
				updateStart();
			}
			if(_consult.hour_end != hourEnd) {
				concat();
				data += 'consult[hour_end]=' + hourEnd;
				_consult.hour_end = hourEnd;
				updateEnd();
			}
			if(_consult.mail_accept != mailAceept) {
				concat();
				data += 'patient[mail_accept]=' + mailAceept;
				_consult.mail_accept = mailAceept;
			}
			if(_consult.confirm != confirm) {
				concat();
				data += 'consult[confirm]=' + confirm;
				_consult.confirm = confirm;
			} 

			data += data.length > 0 ?
				'&consult[patient_id]=' + _consult.patient_id + '&_method=put' : '';  

			function updateStart() {
				_event.start = consultUtil.parseDateToMoment(_consult.date, _consult.hour_ini)		
			}

			function updateEnd() {
				_event.end = consultUtil.parseDateToMoment(_consult.date, _consult.hour_end); 		
			}
			 
			function concat() {
				data += data.length > 0 ? '&' : '';
			}

			return data;
		}
		// Check if date was modified
		function isChangeDate() {
			var date           = consultUtil.parseDate($('#date').val(), '/', '-');
			var hourStart      = $('#hour_ini').val(); 
			var hourEnd        = $('#hour_end').val();
			var eventDate      = _event.start != '' ?
				consultUtil.parseMomentToDate(_event.start) : ''; 
			var eventHourStart = _event.start != '' ?
				consultUtil.parseMomentToHour(_event.start) : '';
			var eventHourEnd   = _event.end != '' ?
				consultUtil.parseMomentToHour(_event.end) : '';

			if(date != eventDate) {
				_event.start = consultUtil.parseDateToMoment(date, hourStart);
				_event.end   = consultUtil.parseDateToMoment(date, hourEnd);
			}
			if(hourStart != eventHourStart)
				_event.start = consultUtil.parseDateToMoment(date, hourStart);
			if(hourEnd != eventHourEnd)
				_event.end = consultUtil.parseDateToMoment(date, hourEnd);
		}
		// Insert consultation
		function insertConsult(obj) {
			var _consult = {
				id: obj.id,
				patient_id: obj.patient_id,				
				name: $('#name').val(),
				email: $('#email').val(),
				telephone: $('#telephone').val(),
				cellphone: $('#cellphone').val(),
				gender: $('input[type="radio"][name="gender"]:checked').val(),
				insurance_id: obj.insurance_id,
				date: consultUtil.parseDate($('#date').val(), '/', '-'),
				hour_ini: $('#hour_ini').val(),
				hour_end: $('#hour_end').val(),
				mail_accept: $('input[id="mail_accept"]:checked').length,
				confirm: $('input[id="confirm"]:checked').length
			}	
			_consults.events.push(_consult); 
		}
		// Open Dialog
		function openDialog() {
			// Check screen heigth
			if($(window).height() <= 700) 
				$('#dialog').dialog( { height:560 } );

			console.log($(window).height());

			consultForm.message('Agendar Consulta', 1);
			$('#dialog').css('display', 'block');
			$('#dialog').dialog('open');
			
			// Check autocomplete
			if(checkAutoComplete === false){
				loadAutoComplete(); 
				checkAutoComplete = true;
			} 		
		}
		// Render events into calendar
		function renderEvent(_event) {
			$('#calendar').fullCalendar('renderEvent', _event, true);
		} 
		// Update events into calendar
		function updateEvent(_event) {
			$('#calendar').fullCalendar('updateEvent', _event);
		}
		// Remove events into calendar
		function removeEvent(_event) {
			$('#calendar').fullCalendar('removeEvents', _event._id);
		}
		// Consult Utilities
		var consultUtil = {
			// Parse Date
			parseDate: function(date, charOld, charNew) {
				var vDate = date.split(charOld);
				return vDate[2] + charNew + vDate[1] + charNew + vDate[0]; 	
			}, 
			// Parse Date to Moment
			parseDateToMoment: function(date, hour) {
				return $.fullCalendar.moment.utc(date + 'T' + hour + ':00');
			},
			// Parse Moment in Date
			parseMomentToDate: function(moment) {
				return (new Date(moment)).toISOString().slice(0, 10); 
			},
			// Parse Moment in Date
			parseMomentToHour: function(moment) {
				var hour = +/ (\d+):/.exec(moment)[1];
				var min  = +/:(\d+):/.exec(moment)[1];

				if(hour.toString().length == 1)
					hour = '0' + hour;	
				if(min.toString().length == 1)
					min = '0' + min;

				return hour.toString() + ':' + min.toString(); 
			} 
		}
	}
});