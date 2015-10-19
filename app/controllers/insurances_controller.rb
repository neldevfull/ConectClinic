# Requires
require 'main_module'

class InsurancesController < ApplicationController
	# Includes
	include MainModule

	def index
		@insurances = get_insurances(12, 0)
	end

	def amount
		count = Insurance.count
		render :json => { :amount => count }
	end

	def main
		limit  = params[:limit]
		offset = params[:offset]
		insurances = get_insurances(limit, offset)
		if insurances.length > 0
			render :json => {
				:response => insurances,
				:error     => false
			}
		else
			render :json => {
				:response => '',
				:error     => true
			}
		end 
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
		@insurance = get_insurance()
	end

	def update
		@insurance = get_insurance()
		if @insurance.update insurance_params
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

	# All Insurances
	def allinsurances
		allinsurances = get_all_insurances()
		render :json => {
			:response => allinsurances,
			:error    => false
		}	
	end

	private

	# Get all Insurances
	def get_all_insurances
		Insurance.select("id", "identifier",
			"name", "city", "state", "status")
			.order("id DESC")
	end

	# Get Insurance 
	def get_insurance
		Insurance.find(params[:id])
	end

	# Get Insurances
	def get_insurances(limit, offset)
		Insurance.select("id", "identifier", "name", "city",
			"state", "status").
			order("id DESC").limit(limit).offset(offset)
	end

	def insurance_params
		params.require(:insurance)
			.permit :identifier, :name,
			:city, :state, :status
	end
end