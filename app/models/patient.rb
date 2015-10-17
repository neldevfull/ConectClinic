#encoding: utf-8 
class Patient < ActiveRecord::Base 
	has_many :consults
	belongs_to :insurance	
	# Constants use in the validation
	NAME_REGEX  = /\A[^0-9`!@#\$%\^&*+_=]+\z/
	EMAIL_REGEX = /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/ 
	MSG_ERROR   = "nao pode ficar em branco"
	# Validate
	validate do |patient|
		# Validate Name
		unless patient.name.present?
			errors.add :name, MSG_ERROR
		else
			if patient.name.length < 3
				errors.add :name, "deve ter no mínimo três letras"
			else
				validates_format_of :name, with: NAME_REGEX 
			end
		end
		# Validate E-mail
		if patient.email.present?
			validates_format_of :email, with: EMAIL_REGEX
		end
		# Validate Telephone or Cellphone
		unless patient.telephone.present?
			unless patient.cellphone.present?			
				errors.add :telephone, "ou celular #{MSG_ERROR}" 						
			end
		end		
		# Validate Gender		
		if patient.gender.present?
			# Treatment due to a bug in form
			patient.gender = "male" if patient.gender == "false"
			if patient.gender != "male" &&
				patient.gender != "female"
				errors.add :gender, "nao deve possuir esse valor"
			end
		end
		# Validate MailAccept						
		if patient.mail_accept != 0 &&
			patient.mail_accept != 1
			errors.add :mail_accept, "nao deve possuir esse valor"
		else
			if patient.mail_accept == 1	
				unless patient.email.present?
					errors.add :email, "deve ser preenchido"
				end
			end
		end		
	end
	#Validation of fields	
	validates :telephone, mask: "(99) 9999-9999", if: :telephone? 
	validates :cellphone, mask: "(99) 99999-9999", if: :cellphone? 
	validates :birth, mask: "99/99/9999", if: :birth?
	validates_presence_of :gender 
end
