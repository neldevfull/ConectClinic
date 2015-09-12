class Patient < ActiveRecord::Base

	validates_length_of :name, minimum: 3, maximum: 40	
	validates_presence_of :name, :email, :gender 
end
