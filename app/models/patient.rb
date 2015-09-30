class Patient < ActiveRecord::Base  

	# Constants use in the validation
	NAME_REGEX  = /\A[^0-9`!@#\$%\^&*+_=]+\z/
	EMAIL_REGEX = /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/ 
	MSG_ERROR   = "nao pode ficar em branco"

	validate do |patient|
		# Validate Name
		unless patient.name.present?
			errors.add :name, MSG_ERROR
		else
			if patient.name.length < 3
				errors.add :name, MSG_ERROR
			else
				validates_format_of :name, with: NAME_REGEX 
			end
		end
		# Validate E-mail
		if patient.email.present?
			validates_format_of :email, with: EMAIL_REGEX
		end
		# Validate Telehone or Cellphone
		unless patient.telephone.present?
			unless patient.cellphone.present?			
				errors.add :telephone, "ou celular #{MSG_ERROR}" 						
			end
		end		
		# Validate Gender		
		if patient.gender.present?
			if patient.gender != "male" &&
				patient.gender != "female"
				errors.add :gender, "nao deve possuir esse valor"
			end
		end
		# Validate MailAccept						
		if patient.mailAccept != 0 &&
			patient.mailAccept != 1
			errors.add :mailAccept, "nao deve possuir esse valor"
		else
			if patient.mailAccept == 1	
				unless patient.email.present?
					errors.add :email, "deve estar preenchido"
				end
			end
		end		
	end
	#Validation of fields	
	validates :telephone, mask: "(99) 9999-9999", if: :telephone? 
	validates :cellphone, mask: "(99) 99999-9999", if: :cellphone? 
	validates :birth, mask: "99/99/9999", if: :birth?
	validates_presence_of :gender 
	# Get Patients
	def getPatients			
		result = getConnect().select_all "SELECT name, email, 
			telephone, cellphone FROM patients ORDER BY name"					
	end
	# Private Methods
	private

	def getConnect
		return ActiveRecord::Base.connection
	end

end
