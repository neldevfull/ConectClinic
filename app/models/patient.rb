class Patient < ActiveRecord::Base

	validates_length_of :name, minimum: 3, maximum: 40	
	validates_presence_of :name, :email, :gender 

	def getPatients			
		result = getConnect().select_all "SELECT name, email, 
			telephone, cellphone FROM patients ORDER BY name"					
	end

	private

	def getConnect
		return ActiveRecord::Base.connection
	end

end
