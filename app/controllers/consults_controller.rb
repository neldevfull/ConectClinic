class ConsultsController < ApplicationController 

	# Check if dates have been sent, if so,
	# search Consults scheduled for the requested week
	def index						
		weekStart    = params[:weekStart]
		weekEnd      = params[:weekEnd]
		if weekStart && weekEnd
			consult  = Consult.new
			consults = Array.new
			result   = consult.getConsults(weekStart, weekEnd)			
			result.each do |consult|
				consults.push(consult)								
			end
			respond_to do |format|			  
			  format.json { render :json => consults.to_json }
			end
		else
			render :index  
		end 
	end

	def create
		@consult = Consult.new consult_params

		if @consult.save
			id = { id: @consult.id }			
			respond_to do |format|
				format.json { render :json => id.to_json }
			end				
		else
			render :index
		end
	end

	def update   
		@consult = Consult.find params[:id] 
		respond_to do |format|
			if @consult.update consult_params
				format.html { redirect_to consults_path } 
			else
				format.html { render :index }
			end
		end
	end

	def destroy
		@consult = Consult.find params[:id] 
		respond_to do |format|
			if @consult.destroy
				format.html { redirect_to consults_path }
			else
				format.html { render :index }
			end
		end
	end

	def consult_params
		params.require(:consult)
			.permit :namePatient, :emailPatient, :telephonePatient,
				:cellphonePatient, :dateConsult, :hourIniConsult, :hourEndConsult 
	end

end 