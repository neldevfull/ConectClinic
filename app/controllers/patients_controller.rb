class PatientsController < ApplicationController
	before_action :set_patient, only: [:edit, :update, :destroy]

	def index
		@patients = Patient.select('id', 'name', 'email', 'tellephone').order('id DESC')
	end

	def new
		@patient = Patient.new
	end 

	def create
		@patient = Patient.new patient_params
		if @patient.save
			flash[:notice] = "Paciente cadastrado com sucesso"
			redirect_to new_patient_path 
		else
			render :new
		end
	end

	def edit
		render :edit
	end

	def update
		if @patient.update patient_params
			flash[:notice] = "Paciente alterado com sucesso"
			redirect_to edit_patient_path
		else
			render :edit
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
