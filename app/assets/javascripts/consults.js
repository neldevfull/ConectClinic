// Initialize vars 
var _consults = {
	weeks: [
		{
			start: '',
			end: ''
		}
	],
	events: []	
};
var _patients = [];
var _event;
var _consult;
var _view    = 'week';
var _control = 0;

$(document).ready(function() { 			
	var resource = window.location.href.toString().split(window.location.host + '/')[1];
	if(resource == 'consults') {
		// Call function that load the calendar
		fullCalendar();									 		
		// WeekDates and Recovers Consults
		weekDates();
		// Call function that load event buttons
		eventButtons();
		// Function responsible get Patient's names 
		getPatients(); 
		// Call function that loads the masks
		loadMasksConsults();
	}
});
// Get Patients Names
function getPatients() {	
	var namePatient  = $('.namePatient');
	var emailPatient = $('.emailPatient'); 
	$.get('patients/patients', function(patients) {	 		
		var names       = [];
		_patients       = patients;
		patients.forEach(function(patient) {			
			names.push(patient.name);
		});
		namePatient.autocomplete({
	      source: names
	    });
	});
	emailPatient.focus(function() {
		_patients.forEach(function(patient) {
			if(patient.name == namePatient.val()) {
				emailPatient.val(patient.email); 
				$('.telephonePatient').val(patient.telephone);
				$('.cellphonePatient').val(patient.cellphone);
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
		_view = 'week';
		loadCalendar();
	});

	$('.fc-agendaDay-button').click(function() {
		_view = 'day';
		loadCalendar();
	});

	$('#agenda_consulta').click(function() {
		preparedFields('', '');
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
		weekStart = parseMomentToDate(view.start);
		weekEnd   = parseMomentToDate(view.end.add(3, 'day')); 	
		recoversConsults(weekStart, weekEnd);
	}	
	else if(weekDay === 4) {
		weekStart = parseMomentToDate(view.start.subtract(4, 'day'));
		weekEnd   = parseMomentToDate(view.end.subtract(1, 'day')); 
		recoversConsults(weekStart, weekEnd);
	}
}
// Make dealings on the dates and loads consultations
function weekDates() {
	var view      = $('#calendar').fullCalendar('getView');
	var weekStart = parseMomentToDate(view.start);
	var weekEnd   = parseMomentToDate(view.end.subtract(1, 'day')); 
	
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
// Function responsible for recovers data of the Consults 
function recoversConsults(_weekStart, _weekEnd) {		
	if(checkWeek(_weekStart, _weekEnd)) {		
		$.ajax({
			type: "GET",
			url: "/consults",
			data: 'weekStart=' + _weekStart +
				'&weekEnd=' + _weekEnd,
			success: function(consults) {	
				if(consults.length > 0){										
					consults.forEach(function(consult) {				
						var _event = {
							title: consult.namePatient,
							start: parseDateToMoment(consult.dateConsult, consult.hourIniConsult),
							end:   parseDateToMoment(consult.dateConsult, consult.hourEndConsult)				
						}				
						renderEvent(_event);	
						_consults.events.push(consult);					
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
			preparedFields(start, end);					
			_event = {
				start: _start,
				end: _end 
			};					
			calendar.fullCalendar('unselect');
			// Open Dialog
			openDialog();
		}, 
		// Update consultation
		eventClick: function(event) {				 				
			_start = parseMomentToHour(event.start);
			_end   = parseMomentToHour(event.end); 
			_date  = parseMomentToDate(event.start); 
	        _control = 2;		
			// Find scheduled consult and carries fields 
			_consults.events.forEach(function(consult) {
				if(consult.namePatient == event.title && 
					consult.hourIniConsult == _start &&
					consult.hourEndConsult == _end &&
					consult.dateConsult == _date) {
					_consult = consult;
					loadFields(consult);
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
	    	_start = parseMomentToHour(event.start);
			_end   = parseMomentToHour(event.end); 
			_date  = parseMomentToDate(event.start); 
			// Find scheduled consult and update consult 
			_consults.events.forEach(function(consult) {
				if(consult.namePatient == _eventStart.title &&
					consult.hourIniConsult == _eventStart.start && 
					consult.hourEndConsult == _eventStart.end &&
					consult.dateConsult == _eventStart.date) { 
					_data = 'consult[dateConsult]=' + _date +
						'&consult[hourIniConsult]=' + _start +
						'&consult[hourEndConsult]=' + _end + 
						'&_method=put';										
					ajaxjQuery('POST', '/consults/' + consult.id,
						_data, 'put');
					// Update into consult
					consult.dateConsult    = _date;
					consult.hourIniConsult = _start;
					consult.hourEndConsult = _end;
					return false;  										
				}
			});
	    },
	    // Event Resize
	    eventResizeStart: function(event) {
	    	_eventStart = eventStart(event);
	    },
	    eventResize: function(event) {
	    	_end  = parseMomentToHour(event.end); 			
	    	// Find scheduled consult and update consult 
			_consults.events.forEach(function(consult) {
				if(consult.namePatient == _eventStart.title &&
					consult.hourIniConsult == _eventStart.start && 
					consult.hourEndConsult == _eventStart.end &&
					consult.dateConsult == _eventStart.date) { 
					_data = 'consult[hourEndConsult]=' + _end + 
						'&_method=put';										
					ajaxjQuery('POST', '/consults/' + consult.id,
						_data, 'put');
					// Update into consult					
					consult.hourEndConsult = _end;
					return false;  										
				}
			});
	    }	
	}); 
  	// Dialog 
	$('#dialog').dialog({
        autoOpen: false,
        height: 480,
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
	                calendar.fullCalendar('removeEvents', _event._id);
	                $.ajax({
						type: "POST",
						url: "/consults/" + _consult.id,
						data: '_method=delete',
						success: function(data) {
							console.log("Consulta removida com sucesso");  
						},
						error: function(error) {
							console.log(error);  
						}
				    });
	                $(this).dialog('close');
	            }
            },
            {
            	text: 'Fechar',
            	open: function() {            		
	        		$(this).addClass('btn btn-info');
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
	            	_event.title = $('.namePatient').val();
	            	if(_control == 1) {
						isChangeDate();   
						renderEvent(_event); 						
	            		var data = 'consult[namePatient]='+$('.namePatient').val()+
	            			'&consult[emailPatient]='+$('.emailPatient').val()+
							'&consult[telephonePatient]='+$('.telephonePatient').val()+
							'&consult[cellphonePatient]='+$('.cellphonePatient').val()+
							'&consult[dateConsult]='+$('.dateConsult').val()+
							'&consult[hourIniConsult]='+$('.hourIniConsult').val()+
							'&consult[hourEndConsult]='+$('.hourEndConsult').val();
						ajaxjQuery('POST', '/consults', data, 'post'); 							            		 
					    $(this).dialog('close'); 	            		            		
	            	} 
	            	else if(_control == 2){	            		
	            		// Update Consult
	            		var data = fieldUpdateConsult();
        				calendar.fullCalendar('updateEvent', _event); 
						updateConsult();
        				ajaxjQuery('POST', '/consults/' + _consult.id,
        					data, 'put');                		             
	            		$(this).dialog('close');
	            	}
            	}
            }
        ],
        close: function () {
        	$('.ui-widget-overlay').removeClass('custom-overlay');
        }
    });
} 
// Event start for Drag n' Drop and Resize
function eventStart(_event) {	
	var start = parseMomentToHour(_event.start);
	var end   = parseMomentToHour(_event.end); 
	var date  = parseMomentToDate(_event.start); 
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
function ajaxjQuery(method, url, data, verb) {
	$.ajax({
		type: method,
		url: url,
		data: data,
		success: function(data) {
			console.log("Sucesso"); 
			if(verb === 'post')
				insertConsult(data.id); 
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
	var data = '';
	var date = parseDate($('.dateFormatConsult').val(), '/', '-');

	if(_consult.namePatient != $('.namePatient').val()){		
		data += 'consult[namePatient]='+$('.namePatient').val();
		_consult.namePatient = $('.namePatient').val();
	} 
	if(_consult.emailPatient != $('.emailPatient').val()) {
		concat();
		data += 'consult[emailPatient]='+$('.emailPatient').val();
		_consult.emailPatient = $('.emailPatient').val();
	}
	if(_consult.telephonePatient != $('.telephonePatient').val()) {
		concat();
		data += 'consult[telephonePatient]='+$('.telephonePatient').val();
		_consult.telephonePatient = $('.telephonePatient').val();
	}
	if(_consult.cellphonePatient != $('.cellphonePatient').val()) {
		concat();
		data += 'consult[cellphonePatient]='+$('.cellphonePatient').val();
		_consult.cellphonePatient = $('.cellphonePatient').val();
	}
	if(_consult.dateConsult != date) {
		concat();		
		data += 'consult[dateConsult]='+date; 
		_consult.dateConsult = date;		
		updateStart();
		updateEnd();
	}
	if(_consult.hourIniConsult != $('.hourIniConsult').val()) {
		concat();
		data += 'consult[hourIniConsult]='+$('.hourIniConsult').val();
		_consult.hourIniConsult = $('.hourIniConsult').val();
		updateStart();
	}
	if(_consult.hourEndConsult != $('.hourEndConsult').val()) {
		concat();
		data += 'consult[hourEndConsult]='+$('.hourEndConsult').val();
		_consult.hourEndConsult = $('.hourEndConsult').val();
		updateEnd();
	} 

	data += data.length > 0 ? '&_method=put' : '';  

	function updateStart() {
		_event.start = parseDateToMoment(_consult.dateConsult, _consult.hourIniConsult)		
	}

	function updateEnd() {
		_event.end = parseDateToMoment(_consult.dateConsult, _consult.hourEndConsult); 		
	}
	 
	function concat() {
		data += data.length > 0 ? '&' : '';
	}

	return data;
}
// Check if date was modified
function isChangeDate() {
	var date           = parseDate($('.dateFormatConsult').val(), '/', '-');
	var hourStart      = $('.hourIniConsult').val(); 
	var hourEnd        = $('.hourEndConsult').val();
	var eventDate      = _event.start != '' ?
		parseMomentToDate(_event.start) : ''; 
	var eventHourStart = _event.start != '' ?
		parseMomentToHour(_event.start) : '';
	var eventHourEnd   = _event.end != '' ?
		parseMomentToHour(_event.end) : '';

	if(date != eventDate) {
		_event.start = parseDateToMoment(date, hourStart);
		_event.end   = parseDateToMoment(date, hourEnd);
		$('.dateConsult').val(date); 
	}
	if(hourStart != eventHourStart)
		_event.start = parseDateToMoment(date, hourStart);
	if(hourEnd != eventHourEnd)
		_event.end = parseDateToMoment(date, hourEnd);
}
// Insert consultation
function insertConsult(id) {
	var _consult = {
		id: id,
		namePatient: $('.namePatient').val(),
		emailPatient: $('.emailPatient').val(),
		telephonePatient: $('.telephonePatient').val(),
		cellphonePatient: $('.cellphonePatient').val(),
		dateConsult: $('.dateConsult').val(),
		hourIniConsult: $('.hourIniConsult').val(),
		hourEndConsult: $('.hourEndConsult').val() 
	}	
	_consults.events.push(_consult); 
}
// Load fields
function loadFields(consult) {
	$('.namePatient').val(consult.namePatient);
	$('.emailPatient').val(consult.emailPatient);
	$('.telephonePatient').val(consult.telephonePatient);
	$('.cellphonePatient').val(consult.cellphonePatient);
	$('.dateFormatConsult').val(parseDate(consult.dateConsult, '-','/'));
	$('.hourIniConsult').val(consult.hourIniConsult);
	$('.hourEndConsult').val(consult.hourEndConsult);
}
// Open Dialog
function openDialog() {
	$('#dialog').css('display', 'block');
	$('#dialog').dialog('open');
}
// Render events into calendar
function renderEvent(_event) {
	$('#calendar').fullCalendar('renderEvent', _event, true);
} 
// Load masks into input form 
function loadMasksConsults() {
	$('.dateFormatConsult').inputmask('99/99/9999');
	$('.telephonePatient').inputmask('(99) 9999-9999');
	$('.cellphonePatient').inputmask('(99) 99999-9999');
	$('.hourIniConsult').inputmask('99:99');
	$('.hourEndConsult').inputmask('99:99'); 
}
// Prepare fields of the New Form
function preparedFields(start, end) {	
	var hourIni    = start != '' ?
		parseMomentToHour(start) : '';
	var hourEnd    = end != '' ?
		parseMomentToHour(end) : '';	
	var date       = start != '' ? 
		parseMomentToDate(start) : '';
	var dateFormat = date != '' ?
		parseDate(date, '-', '/') : '';  

	$('.namePatient').val('');
	$('.emailPatient').val('');
	$('.telephonePatient').val('');
	$('.cellphonePatient').val('');
	$('.dateConsult').val(date); 
	$('.dateFormatConsult').val(dateFormat);
	$('.hourIniConsult').val(hourIni);
	$('.hourEndConsult').val(hourEnd);
}
// Parse Date to Moment
function parseDateToMoment(date, hour) {
	return $.fullCalendar.moment.utc(date + 'T' + hour + ':00');
}
// Parse Date
function parseDate(date, charOld, charNew) {
	var vDate = date.split(charOld);
	return vDate[2] + charNew + vDate[1] + charNew + vDate[0]; 	
} 
// Parse Moment in Date
function parseMomentToDate(moment) {
	return (new Date(moment)).toISOString().slice(0, 10); 
}
// Parse Moment in Date
function parseMomentToHour(moment) {
	var hour = +/ (\d+):/.exec(moment)[1];
	var min  = +/:(\d+):/.exec(moment)[1];

	if(hour.toString().length == 1)
		hour = '0' + hour;	
	if(min.toString().length == 1)
		min = '0' + min;

	return hour.toString() + ':' + min.toString(); 
} 