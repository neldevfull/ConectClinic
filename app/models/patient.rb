class Patient < ActiveRecord::Base  

	validate do |patient|
		if patient.name.blank?
			errors.add :name, "nao pode ficar em branco"
		else
			if patient.name.length < 3
				errors.add :name, "deve possuir no minimo 3 letras"
			end
		end

		if patient.email.blank? 
			unless patient.telephone.present?
				unless patient.cellphone.present?			
					errors.add :email, "ou telefone ou celular nao pode ficar em branco" 						
				end
			end
		end
	end

	validates_presence_of :gender 

	def getPatients			
		result = getConnect().select_all "SELECT name, email, 
			telephone, cellphone FROM patients ORDER BY name"					
	end

	private

	def getConnect
		return ActiveRecord::Base.connection
	end

end
