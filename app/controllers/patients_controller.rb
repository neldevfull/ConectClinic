class PatientsController < ApplicationController
	before_action :set_patient, only: [:edit, :update, :destroy]

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
			render :json => { :patients => patients,
					:error => false }				
		else
			render :json => { :patients => '',
					:error => true }
		end
	end

	def search		
		@value  = params[:value]
		@field  = params[:field]
		@filter = params[:filter]
				
		@patient_search = Patient.where "#{@field} like ?", "%#{@value}%" if @value	
		@patient_search = Patient.where "gender = ?", "#{@filter}" if @filter			  
	end

	def patients		
		patients = get_patients_to_consult
		render :json => { :patients => patients,
					:error => true }				
	end

	def new
		@patient = Patient.new 			
	end 

	def create
		@patient = Patient.new patient_params

		respond_to do |format|
		    if @patient.save
		      format.html { redirect_to new_patient_path, notice: "Paciente cadastrado com sucesso" }		      
		    else
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

	def get_patients(limit, offset)
		Patient.select('id', 'name', 'email', 'telephone', 'cellphone'). 
			order('name ASC').limit(limit).offset(offset)
	end

	def get_patients_to_consult
		Patient.select('id', 'name', 'email', 'telephone', 'cellphone').
			order('name ASC')
	end

	def set_patient
		@patient = Patient.find(params[:id])
	end

	def patient_params
		params.require(:patient)
			.permit :name, :email, :telephone,
				:cellphone, :birth, :gender, :mailAccept
	end

end
