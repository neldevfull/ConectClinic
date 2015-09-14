module ApplicationHelper
	def button_to_with_icon(text, classes)
	    button_tag(classes) do
	      raw text
	    end
	end
end