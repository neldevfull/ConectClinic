class PatientsController < ApplicationController
	before_action :set_patient, only: [:edit, :update, :destroy]

	def index
		@patients = Patient.select('id', 'name', 'email', 'tellephone').order('id DESC')		
	end

	def search		
		@value  = params[:value]
		@field  = params[:field]
		@filter = params[:filter]
				
		@patient_search = Patient.where "#{@field} like ?", "%#{@value}%" if @value	
		@patient_search = Patient.where "gender = ?", "#{@filter}" if @filter			  
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

	def set_patient
		@patient = Patient.find(params[:id])
	end

	def patient_params
		params.require(:patient)
			.permit :name, :email, :tellephone,
				:cellphone, :birth, :gender, :mailAccept
	end

end
