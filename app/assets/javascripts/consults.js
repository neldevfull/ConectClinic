$(document).ready(function() { 			
	var resource = window.location.href.toString().split(window.location.host + '/')[1];
	if(resource == 'consults') {		
		recorversConsults();
		// Call function that load the calendar
		fullCalendar();
		// Call function that loads the masks
		loadMasks();  
	}
});

function recorversConsults() {	 
	$.ajax({
		type: "GET",
		url: "/consults",
		data: 'dateStart=' + $('#dateStart').val() +
			'&dateEnd=' + $('#dateEnd').val(),
		success: function(data) {
			console.log(data);   
		}
    }); 	
}

function fullCalendar() {
	var currentLangCode = 'pt-br';
	var _event;
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
		select: function(start, end) {		
			// Prepared Fields
			preparedFields(start, end);					
			$('#dialog').dialog("open");
			_event = {
				start: start,
				end: end 
			};					
			calendar.fullCalendar('unselect');
			control = 1;
		}, 
		// Update consultation
		eventClick: function(event, element) {
			console.log(event._id + ' '+ event.title);
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
	            		$('#calendar').fullCalendar('renderEvent', _event, true);
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

function preparedFields(start, end) {	
	var hourIni    = '';
	var catchStart = start;
	var catchEnd   = end;
	
	var date       = (new Date(start)).toISOString().slice(0, 10);
	var vDate      = date.split("-");
	date 		   = vDate[2] + '/' + vDate[1] + '/' + vDate[0];

	var hourStart  = +/ (\d+):/.exec(catchStart)[1];
	var minStart   = +/:(\d+):/.exec(catchStart)[1];
	var hourEnd    = +/ (\d+):/.exec(catchEnd)[1];
	var minEnd     = +/:(\d+):/.exec(catchEnd)[1];

	if(hourStart.toString().length == 1)
		hourStart = '0' + hourStart;	
	if(minStart.toString().length == 1)
		minStart = '0' + minStart;

	if(hourEnd.toString().length == 1)
		hourEnd = '0' + hourEnd;
	if(minEnd.toString().length == 1)
		minEnd = '0' + minEnd;

	hourIni = hourStart.toString() + minStart.toString();
	hourEnd = hourEnd.toString() + minEnd.toString();

	$('.namePatient').val('');
	$('.emailPatient').val('');
	$('.telephonePatient').val('');
	$('.cellphonePatient').val('');
	$('.dateConsult').val(date);
	$('.hourIniConsult').val(hourIni);
	$('.hourEndConsult').val(hourEnd);
}

function storeConsults(event) {
	// var consult              = {};
	// consult.id               = event._id;
	// consult.namePatient      = event.title;
	// consult.emailPatient     = $('#emailPatient').val();
	// consult.telephonePatient = $('#telephonePatient').val();
	// consult.cellphonePatient = $('#cellphonePatient').val();
	// consult.dateConsult      = $('#dateConsult').val();  
	// consult.hourIniPatient   = event.start();
	// consult.hourEndPatient   = event.end();	 
}

function loadMasks() {
	$('.dateConsult').inputmask('99/99/9999');
	$('.telephonePatient').inputmask('(99) 9999-9999');
	$('.cellphonePatient').inputmask('(99) 9999[9]-9999');
	$('.hourIniConsult').inputmask('99:99');
	$('.hourEndConsult').inputmask('99:99'); 
}
