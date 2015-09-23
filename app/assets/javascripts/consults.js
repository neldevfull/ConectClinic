var _event;
var consults = {
	events: []
};
 
$(document).ready(function() { 			
	var resource = window.location.href.toString().split(window.location.host + '/')[1];
	if(resource == 'consults') {					 		
		// Recovers Consults
		recoversConsults();	
		// Call function that load the calendar
		fullCalendar(_event);
		// Call function that loads the masks
		loadMasks();  
	}
}); 
// Function responsible for recovers data of the Consults
function recoversConsults() {	 
	$.ajax({
		type: "GET",
		url: "/consults",
		data: 'dateStart=' + $('#dateStart').val() +
			'&dateEnd=' + $('#dateEnd').val(),
		success: function(data) {			
			data.forEach(function(obj) {
				consults.events.push(obj);
				var _event = {
					title: obj.namePatient,
					start: $.fullCalendar.moment.utc(obj.dateConsult+'T'+obj.hourIniConsult+':00'),
					end: $.fullCalendar.moment.utc(obj.dateConsult+'T'+obj.hourEndConsult+':00')
				}				
				renderEvent(_event); 												
			});					
		}
    });     	
}
// Function responsible for FullCalendar and Dialog
function fullCalendar() {
	var currentLangCode = 'pt-br';
	var control = 0;

	var calendar = $('#calendar').fullCalendar({
		header: {
			left: 'title',
			center: 'prev, next today',
			right: 'agendaWeek, agendaDay'
		},
		defaultView: 'agendaWeek', 
		lang: currentLangCode,
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
			// Prepared Fields
			preparedFields(start, end);					
			$('#dialog').dialog("open");
			_event = {
				start: _start,
				end: _end 
			};					
			calendar.fullCalendar('unselect');
			control = 1;
		}, 
		// Update consultation
		eventClick: function(event, element) {		
			var _start = parseMomentoToDate(event.start);
			var _end    = parseMomentoToDate(event.end); 
			// Dealings for start and end to comparison purpose
			_start = [_start.slice(0, 2), ':', _start.slice(2)].join('');
			_end   = [_end.slice(0, 2), ':', _end.slice(2)].join(''); 			
			// Find scheduled patient and carries fields
			consults.events.forEach(function(patient) {
				if(patient.hourIniConsult == _start 
					&& patient.hourEndConsult == _end) {
					loadFields(patient);
					return false;										
				}
			});

			$('#dialog').dialog("open");
	        _event = event;	        
	        control = 2;
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
	            	if(control == 1) {
	            		renderEvent(_event);	            		
	            		schedulerConsult();
	            		// FAZER FUNCAO PARA CHECAR DATE E DATEFORMAT
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
							}
					    });   	            	
	            	}
	            	else if(control == 2)
	            		$('#calendar').fullCalendar('updateEvent', _event);                
	            	$(this).dialog('close');
            	}
            }
        ],
        close: function () {
        	$('.ui-widget-overlay').removeClass('custom-overlay');
        }
    });
}
function schedulerConsult() {
	var _consult = {
		namePatient: $('.namePatient').val(),
		emailPatient: $('.emailPatient').val(),
		telephonePatient: $('.telephonePatient').val(),
		cellphonePatient: $('.cellphonePatient').val(),
		dateConsult: $('.dateConsult').val(),
		hourIniConsult: $('.hourIniConsult').val(),
		hourEndConsult: $('.hourEndConsult').val() 
	}	
	consults.events.push(_consult); 
}
function loadFields(patient) {
	$('.namePatient').val(patient.namePatient);
	$('.emailPatient').val(patient.emailPatient);
	$('.telephonePatient').val(patient.telephonePatient);
	$('.cellphonePatient').val(patient.cellphonePatient);
	$('.dateFormatConsult').val(parseDateToDateFormat(patient.dateConsult));
	$('.hourIniConsult').val(patient.hourIniConsult);
	$('.hourEndConsult').val(patient.hourEndConsult);
}
// Function responsible for render events into calendar
function renderEvent(_event) {
	$('#calendar').fullCalendar('renderEvent', _event, true);
}
// Function responsible for load masks into input form 
function loadMasks() {
	$('.dateFormatConsult').inputmask('99/99/9999');
	$('.telephonePatient').inputmask('(99) 9999-9999');
	$('.cellphonePatient').inputmask('(99) 9999[9]-9999');
	$('.hourIniConsult').inputmask('99:99');
	$('.hourEndConsult').inputmask('99:99'); 
}
// Function responsible for prepare fields of the New Form
function preparedFields(start, end) {	
	var hourIni    = parseMomentoToDate(start);
	var hourEnd    = parseMomentoToDate(end);	
	var date       = (new Date(start)).toISOString().slice(0, 10);
	var dateFormat = parseDateToDateFormat(date); 

	$('.namePatient').val('');
	$('.emailPatient').val('');
	$('.telephonePatient').val('');
	$('.cellphonePatient').val('');
	$('.dateConsult').val(date); 
	$('.dateFormatConsult').val(dateFormat);
	$('.hourIniConsult').val(hourIni);
	$('.hourEndConsult').val(hourEnd);
}
function parseDateToDateFormat(date) {
	var vDate = date.split("-");
	return vDate[2] + '/' + vDate[1] + '/' + vDate[0]; 	
}
// Function responsible for parse Moment in Date
function parseMomentoToDate(moment) {
	var hour = +/ (\d+):/.exec(moment)[1];
	var min  = +/:(\d+):/.exec(moment)[1];

	if(hour.toString().length == 1)
		hour = '0' + hour;	
	if(min.toString().length == 1)
		min = '0' + min;

	return hour.toString() + min.toString(); 
}