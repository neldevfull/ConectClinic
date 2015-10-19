module Validations
	# Constants use in the validation
	STRING_REGEX   = /\A[^0-9`!@#\$%\^&*+_=]+\z/
	ALPHANUM_REGEX = /\A[^`!@#\$%\^&*+_=]+\z/
	
	# Validate is Present?
	def is_present?(attribute)
		return attribute.present?
	end

	# Validate String with Regex
	def string_regex(symbol)
		validates_format_of symbol, with: STRING_REGEX
	end

	# Validate Number and Text with Regex
	def alphanumeric_regex(symbol)
		validates_format_of symbol, with: ALPHANUM_REGEX
	end

	# Validate Minimum
	def minimum?(attribute, minimum)
		return attribute.length < minimum
	end
end