# Requires
require 'main_module'

class InsurancesController < ApplicationController
	# Includes
	include MainModule

	def index
	end

	def new
		@insurance = Insurance.new
	end

	def create
		@insurance = Insurance.new insurance_params
		if @insurance.save
			render :json => { 
				:response => success_message('salvar', 'Convenio'),
				:error => false
			}
		else
			render :json => {
				:response => errors_message(@insurance),
				:error => true
			}
		end
	end

	def edit
	end

	def update
	end

	private 

	def insurance_params
		params.require(:insurance)
			.permit :identifier, :name,
			:city, :state, :status
	end
end