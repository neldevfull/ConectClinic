#encoding: utf-8

# Requires
require 'validations'

class Insurance < ActiveRecord::Base
	# Incluldes
	include Validations
	
	#Relationships
	has_many :patients
	
	# Constants
	MINIMUM 	 = 3
	STRING_ERROR = "nao pode ficar em branco"
	BLANK_ERROR  = "deve ter no minimo #{MINIMUM} letras"

	# Validates
	validate do |insurance|		
		# Validate Identifier
		if presence_of?(insurance.identifier)
			if minimum?(insurance.identifier, MINIMUM)
				errors.add :identifier, BLANK_ERROR
			else
				number_text_regex(:identifier)
			end
		end
		# Validate Name
		unless presence_of?(insurance.name)	
			errors.add :name, STRING_ERROR				
		else
			if minimum?(insurance.name, MINIMUM)
				errors.add :name, BLANK_ERROR
			else
				string_regex(:name)
			end
		end

	end
end
