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
	# Before action
	before_action :set_patient, only: [:edit, :update, :destroy]
	before_action :get_answers_to_user

	def index		
		@patients = get_patients(12, 0)	
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

	def patients		
		patients = get_patients_all
		render :json => { :patients => patients,
					:error => true }				
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

	private

	# Get Patients
	def get_patients(limit, offset)
		Patient.select("id", "name", "email", "telephone",
			"cellphone"). 
			order("name ASC").limit(limit).offset(offset)
	end
	# Get Patients All
	def get_patients_all
		Patient.select("id", "name", "email", 
			"telephone", "cellphone", "gender",
			"mail_accept").
			order("name ASC")
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
