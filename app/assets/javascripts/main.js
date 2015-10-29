(function() {
	"use strict";

	$(function() {
		var domain = window.location.href.toString()
			.split(window.location.host + '/')[1];		
		var resource = domain.split('/')[0];
		var module   = modulejs.require(resource);		
		module();
	});
})()