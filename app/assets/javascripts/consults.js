$(document).ready(function() {
	var currentLangCode = 'pt-br';
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

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
		select: function(start, end) {			
			var title = prompt('Agendar paciente: ');
			if(title) {
				calendar.fullCalendar('renderEvent',
					{
						title: title,
						start: start,
						end: end
					},
					true // Make the event "stick"
				);
			}
			calendar.fullCalendar('unselect');
		}, 
		editable: true,		
		events: [
			{
				title: 'All Day Event',
				start: '2015-09-13'
			},
			{
				title: 'Long Event',
				start: new Date(y, m, d+1, 19, 0),
				end: new Date(y, m, d+1, 22, 30),

			}
		]
	});
});