class HomeController < ApplicationController
	# Authentication
	before_action :require_authentication, only: [:home]

	def home
	end

end
