modulejs.define('pagination', ['allObjs', 'renderer'],
	function(allObjs, renderer) {
	return {	

		// Attributes
		pages: [],

		// Start Pagination
		startPagination: function() {
			this.pagination(allObjs.objs.length, 1);
		},

		// Mount page
		mountPage: function(items, firstTwelve) {
			this.pagination(items, 1);
			renderer.content(firstTwelve, allObjs.entity);
		},

		// Get first
		getFirst: function() {
			var firstTwelve = [];
			var counter     = allObjs.objs.length;
			var count       = counter > 12 ?
				12 : counter;
			for(var i = 0; i < count; i++) {
				firstTwelve.push(allObjs.objs[i]);
			}
			this.pages = [];
			this.setPages(firstTwelve, 1);
			return firstTwelve;
		},

		// Search
		search: function(keys, value, selectSearch) {
			_this = this;
			var found = [];
			var length;
			// Check key and find
			keys.forEach(function(key) {
				if(selectSearch.val() === key) {
					found = _this.find(key, value);
					return false;
				}
			});
			// Check found and finish
			length = found.length;
			if(length > 0) {
				this.storeFound(found, length);
				value.val('');
			}
		},

		find: function(key, value) {
			var found = [];
			var newValue;
			if(key === 'name') {
				newValue = new RegExp(
					'^' + value.val(), 'i'); 
			}
			else {
				newValue = new RegExp(value.val(), 'i');	
			}

			$.grep(allObjs.objs, function(obj) {
				if(newValue.test(obj[key]))
					found.push(obj);
				else if(key === 'cellphone') {
					if(newValue.test(obj['telephone']))
						found.push(obj);
				}
		    });

			return found;
		},
		
		// Filer
		filter: function(keys, fields, selectOption) {
			var found = [];
			var length;

			for(var i = 0; i < keys.length; i++) {
				if(selectOption.val() === keys[i]) {
					found = this.filtering(keys[i], fields[i]);
					return false;
				}	
			}

			length = found.length;
			if(length > 0) {
				this.storeFound(found, length); 
			}
		},

		filtering: function(key, field) {
			var found = [];
			allObjs.objs.forEach(function(obj) {
				if(obj[field] == key) {
					found.push(obj);
				}
			});
			return found; 
		},

		// Store found
		storeFound: function(found, items) {
			var pageNumber  = 1;
			var objs        = [];
			var firstTwelve = [];

			for(var i = 1; i <= items; i++) {
				objs.push(found[i - 1]);
				if(i === 12 || (items < 12 && items === i)) {
					firstTwelve = objs;
				}
				if(i === (pageNumber * 12) || items === i) {
					this.setPages(objs, pageNumber);
					objs = [];
					pageNumber++;
				}
			}
			this.mountPage(items, firstTwelve); 
		},

		// Calc items
		calcItems: function(amount) {
			return Math.ceil(amount / 12);
		},

		// Get Entity to pagination
		getEntityToPagination: function(offset, pageNumber) {
			_this = this;
			$.get(allObjs.entity + '/main/12/'+offset, function(objs) {	
				if(objs.error === false) {											
					if(objs.response.length > 0) {
						// Set Patients Pages
						_this.setPages(objs.response, pageNumber);
						// Render Grid Patients
						renderer.content(objs.response, allObjs.entity);
					}
					else {
						$('#no_' + allObjs.entity).css('display', 'block');
						$('#grid').css('display', 'none');
					}
				}
				else if(objs.error === true) {
					console.log('Erro ao buscar pacientes');
				}
			});	
		},

		// Pagination
		pagination: function(itemsP, itemsOnPage) {
			items = this.calcItems(itemsP);
			_this = this;
			$('.simple_pagination').pagination({
		        items: items,
		        itemsOnPage: itemsOnPage,
		        cssStyle: 'light-theme',
		        prevText: 'Anterior',
		        nextText: 'Próximo',
		        onPageClick: function(pageNumber) { 
		        	var found    = false;
		        	var objs     = [];
		        	if(this.pages.length > 0) {		        		
			        	this.pages.forEach(function(page) {
			        		if(page.number === pageNumber) {
			        			objs  = page.objs;
			        			found = true;
			        			return false;
			        		}
			        	});
		        	}
		        	if(found === true) {   
		        		renderer.content(objs, allObjs.entity); 
		        	}	
		        	else {
			        	var offset = (pageNumber - 1) * 12;
			        	_this.getEntityToPagination(offset, pageNumber);
		        	}       	 
		        }
		    });
		},

		// Set Pages
		setPages: function(objs, pageNumber) {					
			var page    = {};
			page.number = pageNumber;
			page.objs   = objs;				
			this.pages.push(page); 
		}	

	}
});		