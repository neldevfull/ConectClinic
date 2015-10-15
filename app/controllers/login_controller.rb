class LoginController < ApplicationController

	def index
		@login = Login.new
	end
end