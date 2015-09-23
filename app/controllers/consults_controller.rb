class ConsultsController < ApplicationController 

	# Check if dates have been sent, if so,
	# search Consults scheduled for the requested week
	def index				
		dateStart    = params[:dateStart]
		dateEnd      = params[:dateEnd]
		if dateStart && dateEnd
			array    = Array.new
			consult  = Consult.new
			result   = consult.getConsults(dateStart, dateEnd)			
			result.each do |consult|
				array.push(consult)								
			end
			respond_to do |format|			  
			  format.json { render :json => array.to_json }
			end
		else
			render :index  
		end 
	end

	def create
		@consult = Consult.new consult_params

		respond_to do |format|
			if @consult.save
				format.html { redirect_to consults_path, notice: "Consulta agendada com sucesso" }
			else
				format.html { render :index }
			end
		end
	end

	def update   
		@consult = Consult.find params[:id] 
		respond_to do |format|
			if @consult.update consult_params
				format.html { redirect_to consults_path, notice: "Consulta alterada com sucesso" } 
			else
				format.html {render :index }
			end
		end
	end

	def consult_params
		params.require(:consult)
			.permit :namePatient, :emailPatient, :telephonePatient,
				:cellphonePatient, :dateConsult, :hourIniConsult, :hourEndConsult 
	end

end