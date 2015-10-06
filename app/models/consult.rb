#encoding: utf-8 
class Consult < ActiveRecord::Base
	# Constants use in the validation
	NAME_REGEX  = /\A[^0-9`!@#\$%\^&*+_=]+\z/
	EMAIL_REGEX = /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/ 
	MSG_ERROR   = "nao pode ficar em branco"

	validate do |consult|
		# Validate Name
		unless consult.namePatient.present?
			errors.add :namePatient, MSG_ERROR
		else
			if consult.namePatient.length < 3
				errors.add :namePatient, "deve ter no mínimo três letras"
			else
				validates_format_of :namePatient, with: NAME_REGEX 
			end
		end
		# Validate E-mail
		if consult.emailPatient.present?
			validates_format_of :emailPatient, with: EMAIL_REGEX
		end
		# Validate Telephone or Cellphone
		unless consult.telephonePatient.present?
			unless consult.cellphonePatient.present?			
				errors.add :telephonePatient, "ou celular #{MSG_ERROR}" 						
			end
		end		

		# Validate Gender				
		# if consult.genderPatient.present?
		# 	# Treatment due to a bug in form
		# 	consult.genderPatient = "male" if consult.genderPatient == "false"
		# 	if consult.genderPatient != "male" &&
		# 		consult.genderPatient != "female"
		# 		errors.add :gender, "nao deve possuir esse valor"
		# 	end
		# end

		# Validate MailAccept						
		# if consult.mailAccept != 0 &&
		# 	consult.mailAccept != 1
		# 	errors.add :mailAccept, "nao deve possuir esse valor"
		# else
		# 	if consult.mailAccept == 1	
		# 		unless consult.emailPatient.present?
		# 			errors.add :emailPatient, "deve ser preenchido"
		# 		end
		# 	end
		# end	
			
	end
	#Validation of fields	
	validates :telephonePatient, mask: "(99) 9999-9999", if: :telephonePatient? 
	validates :cellphonePatient, mask: "(99) 99999-9999", if: :cellphonePatient? 	
	validates :dateConsult, mask: "9999-99-99", if: :dateConsult?
	validates :hourIniConsult, mask: "99:99", if: :hourIniConsult?
	validates :hourEndConsult, mask: "99:99", if: :hourEndConsult?

	validates_presence_of :dateConsult
	validates_presence_of :hourEndConsult
	validates_presence_of :hourIniConsult
	# validates_presence_of :genderPatient 

	def getConsults(weekStart, weekEnd)			
		result = getConnect().select_all "SELECT id, namePatient, emailPatient,
			telephonePatient, cellphonePatient, dateConsult, hourIniConsult,
			hourEndConsult FROM consults WHERE dateConsult BETWEEN '#{weekStart}'
			AND '#{weekEnd}';"					
	end

	private

	def getConnect
		return ActiveRecord::Base.connection
	end

end 