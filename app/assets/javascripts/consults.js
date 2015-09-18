$(document).ready(function() {
	var currentLangCode = 'pt-br';
	// var date = new Date();
	// var d = date.getDate();
	// var m = date.getMonth();
	// var y = date.getFullYear();

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
	    		end: '18:00'
	    	},
	    contentHeight: 460,
		selectable: true,
		selectHelper: true,		
		editable: true,	
		// Insert consultation			
		select: function(start, end) {		
			$('#name').val('');								
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
			$('#name').val(event.title);
			$('#dialog').dialog("open");
	        _event = event;	        
	        control = 2;
	    }	
	});

	$('#dialog').dialog({
        autoOpen: false,
        height: 480,
        width: 720,
        modal: false,
        closeOnEscape: false,
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
	            	_event.title = $('#name').val();
	            	if(control == 1)
	            		$('#calendar').fullCalendar('renderEvent', _event, true);  	            	
	            	else if(control == 2)
	            		$('#calendar').fullCalendar('updateEvent', _event);                
	            	$(this).dialog('close');
            	}
            }
        ],
        close: function () {
        }
    });  
});