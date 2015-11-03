(function() {
	"use strict";

	$(function() {
		//  Get domain
		var domain = window.location.href.toString()
			.split(window.location.host + '/')[1];		
		
		// Load modules
		var resource = domain.split('/')[0];
		var module   = modulejs.require(resource);		
		var events   = modulejs.require('events');
		
		// Execute modules
		module();
		events();
	});
})()