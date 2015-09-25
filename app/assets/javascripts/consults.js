var _consults = {
	weekStarts: [],
	events: []	
};
var _event;
var _consult;
var _control = 0;

$(document).ready(function() { 			
	var resource = window.location.href.toString().split(window.location.host + '/')[1];
	if(resource == 'consults') {
		// Initialize vars
		var _weekStart = $('#weekStart');
		var _weekEnd   = $('#weekEnd');							 		
		// Recovers Consults
		recoversConsults(_weekStart, _weekEnd);	
		// Call function that load the calendar
		fullCalendar();
		// Call function that loads the masks
		loadMasks();
		// Call function that load event buttons
		eventButtons();  		
	}
}); 
// Function responsible for load event buttons
function eventButtons() {			
	var weekStart;
	var weekEnd; 
	var _weekStart = $('#weekStart');
	var _weekEnd   = $('#weekEnd');

	$('.fc-next-button').click(function() {	
		weekDates();
    }); 

	$('.fc-prev-button').click(function() {
		weekDates();
	});

	$('#agenda_consulta').click(function() {
		preparedFields('', '');
		_control = 1;
		_event = {
			title: '',
			start: '',
			end: '' 
		};
		$('#dialog').dialog("open");
	});

	function weekDates() {
    	weekStart = $('#calendar').fullCalendar('getDate');    	
    	weekEnd   = $('#calendar').fullCalendar('getDate');	

    	weekStart = parseMomentToDate(weekStart.add(1, 'days'));
    	weekEnd   = parseMomentToDate(weekEnd.add(5, 'days'));

		_weekStart.val(weekStart);
		_weekEnd.val(weekEnd);
		recoversConsults(_weekStart, _weekEnd); 
	}
} 
// Function responsible for recovers data of the Consults 
function recoversConsults(_weekStart, _weekEnd) {	
	var success = true;
	_consults.weekStarts.forEach(function(weekStart) {		
		if(weekStart == _weekStart.val()) {
			success = false;
			return false;
		}
	}); 	
	if(success === true) {		
		$.ajax({
			type: "GET",
			url: "/consults",
			data: 'weekStart=' + _weekStart.val() +
				'&weekEnd=' + _weekEnd.val(),
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
	}
	_consults.weekStarts.push(_weekStart.val());
}
// Function responsible for FullCalendar and Dialog
function fullCalendar() {
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
		// Insert consultation			
		select: function(start, end, jsEvent, view) {	
			var _start = start;
			var _end   = end;			
			_control = 1;
			// Prepared Fields
			preparedFields(start, end);					
			_event = {
				start: _start,
				end: _end 
			};					
			calendar.fullCalendar('unselect');
			$('#dialog').dialog("open");
		}, 
		// Update consultation
		eventClick: function(event, element) {					
			var _start = parseMomentToHour(event.start);
			var _end   = parseMomentToHour(event.end); 
			var _date  = parseMomentToDate(event.start); 
	        _control = 2;
			// Dealings for start and end to comparison purpose
			_start = [_start.slice(0, 2), ':', _start.slice(2)].join('');
			_end   = [_end.slice(0, 2), ':', _end.slice(2)].join(''); 			
			// Find scheduled consult and carries fields 
			_consults.events.forEach(function(consult) {
				if(consult.hourIniConsult == _start 
					&& consult.hourEndConsult == _end
					&& consult.dateConsult == _date) {
					_consult = consult;
					loadFields(consult);
					return false;										
				}
			});
	        _event = event;	        
			$('#dialog').dialog("open");
	    }	
	});
  
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
	                $('#calendar').fullCalendar('removeEvents', _event._id);
	                $.ajax({
						type: "POST",
						url: "/consults/" + _consult.id,
						data: '_method=delete',
						success: function(data) {
							console.log(data);
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
        				insertConsult();
						renderEvent(_event); 	            		
	            		$.ajax({
							type: "POST",
							url: "/consults",
							data: 'consult[namePatient]='+$('.namePatient').val()+'&consult[emailPatient]='+$('.emailPatient').val()+
								'&consult[telephonePatient]='+$('.telephonePatient').val()+
								'&consult[cellphonePatient]='+$('.cellphonePatient').val()+
								'&consult[dateConsult]='+$('.dateConsult').val()+
								'&consult[hourIniConsult]='+$('.hourIniConsult').val()+
								'&consult[hourEndConsult]='+$('.hourEndConsult').val(),
							success: function(data) {
								console.log("Paciente agendado com sucesso");
							},
							error: function(error) {
								console.log(error);
							}
					    });  
					    $(this).dialog('close'); 	            		            		
	            	} 
	            	else if(_control == 2){	            		
	            		// Update Consult
	            		var pData = fieldUpdateConsult();
						updateConsult();
        				$('#calendar').fullCalendar('updateEvent', _event);                 
		            	$.ajax({
							type: "POST",
							url: "/consults/" + _consult.id,
							data: pData,
							success: function(data) {
								console.log("Consulta alterada com sucesso");  
							},
							error: function(error) {
								console.log(error);  
							}
					    }); 
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
function insertConsult() {
	var _consult = {
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
// Render events into calendar
function renderEvent(_event) {
	$('#calendar').fullCalendar('renderEvent', _event, true);
} 
// Load masks into input form 
function loadMasks() {
	$('.dateFormatConsult').inputmask('99/99/9999');
	$('.telephonePatient').inputmask('(99) 9999-9999');
	$('.cellphonePatient').inputmask('(99) 9999[9]-9999');
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

	return hour.toString() + min.toString(); 
} 