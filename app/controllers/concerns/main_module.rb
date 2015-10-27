module MainModule

	# Render response
	def render_response(response, verb, fail)
		render :json => {
			:response => response,
			:verb     => verb,
			:fail     => fail
		}
	end

	# Success Message
	def success_message(action, string)
		return "Sucesso ao #{action} #{string}"
	end

	# Errors Message
	def errors_message(entity)
		errors  = ""
		counter = entity.errors.full_messages.count					
		entity.errors.full_messages.each do |message|
			errors += message
			counter -= 1
			if counter != 0
				errors += ", "
			end
		end	
		return errors
	end	
end