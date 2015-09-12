class PatientsController < ApplicationController

	def new
		@patient = Patient.new
	end 

	def create
		@patient = Patient.new patient_params
		if @patient.save
			flash[:notice] = "Paciente cadastrado com sucesso"
			redirect_to root_path
		else
			rendering :new
		end
	end

	private

	def patient_params
		params.require(:patient)
			.permit :name, :email, :tellephone,
				:cellphone, :birth, :gender, :mailAccept
	end

end
