require 'main_module'

class HomeController < ApplicationController
	include MainModule

	# Authentication
	before_action :require_authentication, only: [:home]
	# User Session
	before_action :get_healthcare_to_user, :get_user_current,
		only: [:home]		

	def home
	end

end
