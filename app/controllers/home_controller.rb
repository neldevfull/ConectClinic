# Require
require 'main_module'

class HomeController < ApplicationController
	
	# Include
	include MainModule

	# Before Action
	before_action :get_answers_to_user

	def home				
	end
end