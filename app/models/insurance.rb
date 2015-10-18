#encoding: utf-8

# Requires
require 'validations'

class Insurance < ActiveRecord::Base
	# Incluldes
	include Validations
	
	#Relationships
	has_many :patients
	
	# Constants
	BLANK_ERROR    = "nao pode ficar em branco"

	# Validates
	validate do |insurance|		
		# Validate Identifier
		if is_present?(insurance.identifier)
			if minimum?(insurance.identifier, 3)
				errors.add :identifier, minimum_error(3)
			else
				number_text_regex(:identifier)
			end
		end
		# Validate Name
		unless is_present?(insurance.name)	
			errors.add :name, BLANK_ERROR				
		else
			if minimum?(insurance.name, 3)
				errors.add :name, minimum_error(3)
			else
				string_regex(:name)
			end
		end
		# Validate City
		if is_present?(insurance.city)
			minimum = 5
			if minimum?(insurance.city, 5)
				errors.add :city, minimum_error(5)
			else
				string_regex(:city)
			end
		end
		# Validate State
		if is_present?(insurance.state)
			minimum = 2
			if minimum?(insurance.state, 2)
				errors.add :state, minimum_error(2)
			else
				string_regex(:state)
			end
		end
		# Validate Status
		if insurance.status != 0 &&
			insurance.status != 1
			errors.add :status, "nao e valido"
		end
	end

	private
	
	# Output message for minimum value
	def minimum_error(minimum)
		return "deve ter no minimo #{minimum} letras"
	end
end
