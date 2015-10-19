# Requires
require 'main_module'
require 'patients_module'

class ConsultsController < ApplicationController 
	# Includes
	include PatientsModule
	include MainModule

	# Check if dates have been sent, if so,
	# search Consults scheduled for the requested week
	def index()						
		weekStart    = params[:weekStart]
		weekEnd      = params[:weekEnd]
		if weekStart && weekEnd
			consults = Array.new			
			result   = getConsults(weekStart, weekEnd)						
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
		patient = Patient.new patient_params
		id      = patient_exist?(patient)
		insurance_value = params[:consult][:insurance_id]

		# Check if Insurance no exist
		if insurance_value.to_i == 0 && 
			insurance_value != "0" 
			insurance = Insurance.new(
				name: insurance_value)
			if insurance.save
				params[:consult][:insurance_id] = insurance.id
			else
				create_response(false, insurance)
				return				
			end  
		end

		Patient.transaction do
			if id == 0
				if patient.save
					@consult = patient.consults.new consult_params					
					if @consult.save
						create_response(true, @consult)
					else
						create_response(false, @consult)
					end
				else
					create_response(false, patient)
					raise ActiveRecord::Rollback
				end
			else
				patient = Patient.find id
				if patient.update patient_params
					@consult = Consult.new consult_params
					@consult.patient_id = id
					if @consult.save
						create_response(true, @consult)
					else
						create_response(false, @consult)
					end
				end
			end
		end
	end


	def update  
			success = true
			msg     = ""

			unless params[:patient].blank?  
				patient = Patient.find params[:consult][:patient_id]		
				if patient.update patient_params
					success = true
				else
					msg += errors_message(@consult)					
				end		
			end
			
			unless params[:consult].blank? 
				@consult = Consult.find params[:id]
				if @consult.update consult_params
					success = true		
				else					
					msg = ', ' unless msg != ''
					msg += errors_message(@consult)
				end
			end

			if success
				render :json => { :response => "",
					:error => false }
			else
				render :json => { :response => msg,
					:error => true }
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

	private

	def create_response(success, obj)
		if success
			render :json => { :response => 
				{ 
					id: obj.id, 
					patient_id: obj.patient_id,
					insurance_id: obj.insurance_id
				},
				:error => false }
		else
			render :json => { :response => errors_message(obj),
				:error => true }
		end
	end

	def getConsults weekStart, weekEnd
		@consult = Consult.select("id", "patient_id", "insurance_id", "patients.name",
			"patients.email", "patients.telephone", "patients.cellphone", 
			"patients.gender", "patients.mail_accept", "date",
			"hour_ini", "hour_end", "confirm", "status").
			joins("LEFT JOIN patients ON patients.id = patient_id").			
			where("consults.status = 1 AND date BETWEEN '#{weekStart}' AND '#{weekEnd}'")
	end

	def consult_params
		params.require(:consult)
			.permit :patient_id, :insurance_id, :name, :email,
				:telephone, :cellphone, :gender, :date, 
				:hour_ini, :hour_end, :confirm,
				:scheduling, :status  
	end

	def patient_params
		params.require(:patient)
			.permit :name, :email, :telephone,
				:cellphone, :gender, :mail_accept
	end

end 