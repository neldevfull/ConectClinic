$(document).ready(function() {
	var currentLangCode = 'pt-br';
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var name;
	var start;
	var end;
	var _event;

	var calendar = $('#calendar').fullCalendar({
		header: {
			left: 'title',
			center: 'prev,next today',
			right: 'agendaWeek,agendaDay'
		},
		defaultView: 'agendaWeek', 
		lang: currentLangCode,
		selectable: true,
		selectHelper: true,		
		editable: true,				
		select: function(start, end) {	
			$('#name').val('');							
			$('#dialog').dialog("open");
			_event = {
				start: start,
				end: end 
			};					
			calendar.fullCalendar('unselect');
		}, 	
	});

	$("#dialog").dialog({
        autoOpen: false,
        height: 350,
        width: 700,
        modal: true,
        buttons: {
            'Create event': function () { 
            	_event.title = $('#name').val();
            	$('#calendar').fullCalendar('renderEvent', _event, true);  	            	
                $(this).dialog('close');
            },
            Cancel: function () {
                $(this).dialog('close');
            }
        },

        close: function () {
        }
    });   

});