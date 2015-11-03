module ApplicationHelper
	def empty?(field)
		if field
			return true
		else
			return false
		end
	end

	# Format date 
	def format_date(date_str)
		date = Date.parse date_str
		date.strftime('%d/%m/%Y')
	end

end
