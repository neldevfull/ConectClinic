class ConsultsController < ApplicationController
	
	def index		
		dateStart    = params[:dateStart]
		dateEnd      = params[:dateEnd]
		if dateStart && dateEnd
			consult  = Consult.new
			result   = consult.getConsults(dateStart, dateEnd)			
			result.each do |consult|				
				puts consult
			end
		end 
		render :index  
	end

	def new
		@consult = Consult.new
		render :index
	end

	def create
		@consult = Consult.new patient_params

		respond_to do |format|
			if @consult.save
				format.html { redirect_to new_patient_path, notice: "Consulta agendada com sucesso" }
			else
				format.html { render :index }
			end
		end
	end

	def patient_params
		params.require(:consult)
			.permit :namePatient, :emailPatient, :telephonePatient,
				:cellphonePatient, :dateConsult, :hourIniConsult, :hourEndConsult 
	end

end