$(document).ready(function() { 		
	// Call function that loads the masks
	loadMasks();
	// Call function that load the calendar
	fullCalendar();  
});

function loadMasks() {
	$('#dateConsult').inputmask('99/99/9999');
	$('#telephonePatient').inputmask('(99) 9999-9999');
	$('#cellphonePatient').inputmask('(99) 9999[9]-9999');
	$('#hourIniConsult').inputmask('99:99');
	$('#hourEndConsult').inputmask('99:99'); 
}

function fullCalendar() {
	var currentLangCode = 'pt-br';
	var _event;
	var control = 0;

	var calendar = $('#calendar').fullCalendar({
		header: {
			left: 'title',
			center: 'prev,next today',
			right: 'agendaWeek,agendaDay'
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
			// Clean Fields
			cleanFields();					
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
			loadFields(event);
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
	            	_event.title = $('#namePatient').val();
	            	if(control == 1) {
	            		$('#calendar').fullCalendar('renderEvent', _event, true);
	            		//storeConsults(_event);  	            	
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

function loadFields(event) {	
	var hourIni    = '';
	var catchStart = event.start;
	var catchEnd   = event.end;
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

	hourIni = hourStart + minStart;
	hourEnd = hourEnd + minEnd;

	$('#namePatient').val(event.title);
	$('#hourIniConsult').val(hourIni);
	$('#hourEndConsult').val(hourEnd);
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

function recorversFields(event) {

}

function cleanFields() {
	$('#namePatient').val('');
	$('#emailPatient').val('');
	$('#telephonePatient').val('');
	$('#cellphonePatient').val('');
	$('#dateConsult').val('');
	$('#hourIniConsult').val('');
	$('#hourEndConsult').val('');
}