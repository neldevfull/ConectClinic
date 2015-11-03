# Requires
require 'main_module'
require 'patients_module'

class PatientsController < ApplicationController
	# Includes
	include MainModule
	include PatientsModule

	# Authentication
	before_action :require_authentication, only: [:create, :update, 
		:index, :new, :edit, :main, :amount, :patients]
	# Set Patient
	before_action :set_patient, only: [:edit, :update, :destroy]
	# User Session
	before_action :get_healthcare_to_user, :get_user_current,
		only: [:index, :new, :edit]				

	def index		
		@patients = get_patients(12, 0)	
	end

	def new
		@patient = Patient.new 			
	end 

	def create
		@patient = Patient.new patient_params

		respond_to do |format|
			if patient_exist?(@patient) == 0
			    if @patient.save
			      format.html { redirect_to new_patient_path, notice: "Paciente cadastrado com sucesso" }		      
			    else
					format.html { render :new }			      		      
			    end
			 else
			 	@patient.errors[:base] << "Paciente ja cadastrado"
			 	format.html { render :new }
			end
		end
	end

	def edit
		render :edit
	end

	def update
		respond_to do |format|
		    if @patient.update patient_params
		      format.html { redirect_to edit_patient_path, notice: "Paciente alterado com sucesso" }		      
		    else
		      format.html { render :new }		      
		    end
		end
	end

	def amount
		count = Patient.count
		render :json => { :amount => count }
	end

	def main
		limit  = params[:limit]
		offset = params[:offset]		
		patients = get_patients(limit, offset)					 
		if patients.length > 0
			render :json => { 
				:patients => patients,
				:error => false
			}				
		else
			render :json => { 
				:patients => '',
				:error => true
			}
		end
	end

	def allpatients		
		patients = get_all_patients(params[:resource])
		render :json => { 
			:response => patients,
			:verb     => 'get',
			:error    => true 
		}				
	end

	private

	# Get Patients
	def get_patients(limit, offset)
		patients = []
		results = Patient.new.get_patients(
			limit, offset)
	end

	# Get Patients All
	def get_all_patients(resource)
		if resource == "patients"
			Patient.new.get_all_patients()
		else
		Patient.select("id", "name", "email", 
			"telephone", "cellphone", "gender",
			"mail_accept").
			order("name ASC")
		end
	end

	# Set Patient
	def set_patient
		@patient = Patient.find(params[:id])
	end

	# Patient Params
	def patient_params
		params.require(:patient)
			.permit :name, :email, :telephone,
				:cellphone, :birth, :gender,
				:mail_accept, :status
	end

end
