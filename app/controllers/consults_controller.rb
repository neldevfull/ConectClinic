class ConsultsController < ApplicationController
	
	def index
		@patient = Patient.new
		@consult = Consult.new		
	end

	def new
		@consult = Consult.new
		render :new
	end
end