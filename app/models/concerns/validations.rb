module Validations
	# Constants use in the validation
	STRING_REGEX   = /\A[^0-9`!@#\$%\^&*+_=]+\z/
	ALPHANUM_REGEX = /\A[^`!@#\$%\^&*+_=]+\z/
	EMAIL_REGEX    = /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/ 
	PASSW_REGEX    = /\A(?=.*[a-zA-Z])(?=.*[0-9]).{6,}+\z/
	
	# Validate is Present?
	def is_present?(attribute)
		return attribute.present?
	end

	# Validate Minimum
	def minimum?(attribute, minimum)
		return attribute.length < minimum
	end

	# Output message for minimum value
	def minimum_error(minimum)
		return "deve ter no minimo #{minimum} letras"
	end

	# Validate String with Regex
	def string_regex(symbol)
		validates_format_of symbol, with: STRING_REGEX
	end

	# Validate Number and Text with Regex
	def alphanumeric_regex(symbol)
		validates_format_of symbol, with: ALPHANUM_REGEX
	end

	# Validate E-mail
	def email_regex(symbol)
		validates_format_of symbol, with: EMAIL_REGEX 
	end

	# Validate Password
	def passw_regex(symbol)
		validates_format_of symbol, with: PASSW_REGEX
	end

end
