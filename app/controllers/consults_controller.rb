class ConsultsController < ApplicationController
	
	def show
		@consult = Consult.new		
	end

	def new
		@consult = Consult.new
		render :new
	end
end