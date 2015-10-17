module Validations
	# Constants use in the validation
	STRING_REGEX     = /\A[^0-9`!@#\$%\^&*+_=]+\z/
	NUMBERTEXT_REGEX = /\A(?!_)(?:[a-z0-9]_?)*[a-z](?:_?[a-z0-9])*(?<!_)\z/i
	
	# Validate Presence of
	def presence_of?(attribute)
		# validates_presence_of attribute
		return attribute.present?
	end

	# Validate String with Regex
	def string_regex(symbol)
		validates_format_of symbol, with: STRING_REGEX
	end

	# Validate Number and Text with Regex
	def number_text_regex(symbol)
		validates_format_of symbol, with: NUMBERTEXT_REGEX
	end

	# Validate Minimum
	def minimum?(attribute, minimum)
		return attribute.length < minimum
	end
end