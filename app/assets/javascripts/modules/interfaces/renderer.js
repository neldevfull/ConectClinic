modulejs.define('renderer', function() {
	return {
		content: function(objs, entity) {			
			switch(entity) {
				case 'insurances':
					var content = '';
					objs.forEach(function(obj) {
						content +=
						'<tr>' +
						'<th>' + obj.name + '</th>' + 
						'<th><a href="' + entity + '/' + obj.id + '/edit">' + 
							obj.identifier + '</th>' +
						'<th>' + obj.city + '</th>' +
						'<th>' + obj.state + '</th>' +
						'<th>' + obj.status + '</th>' +
						'</tr>';
					});
					$('#content_'+entity).empty().append(content);
				break;

				default: break;
			}
		},
	}
});
