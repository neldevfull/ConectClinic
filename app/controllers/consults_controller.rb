class ConsultsController < ApplicationController
	def new
		@consult = Consult.new
	end
end