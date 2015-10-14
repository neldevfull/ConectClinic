(function() {
	"use strict";

	$(function() {
		var url = window.location.href.toString()
			.split(window.location.host + '/')[1];		
		var resource = url.split('/')[0];
		var module   = modulejs.require(resource);		
		module();
	});
})()