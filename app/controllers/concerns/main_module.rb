module MainModule

	# Get healthcare to user
	def get_healthcare_to_user	
		@answers ||= []
		healthcare = get_user_current()
		
		if healthcare != "healthcare"
			results  = User.new
				.get_healthcare_belonging(
					healthcare)

			results.each do |result|
				answer = User.new result
				@answers << answer
			end
		end
	end
	
	# Get user session
	def get_user_current
		@user_current = current_user()
	end

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