module UserModule

	# Accepts answers?
	def accepts_answers?(career, answers)
		if answers.count > 0 &&
			career == "healthcare"
			false
		else
			true
		end
	end

end