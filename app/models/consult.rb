class Consult < ActiveRecord::Base
	
	def getConsults(weekStart, weekEnd)			
		conn = ActiveRecord::Base.connection
		result = conn.select_all "SELECT id, namePatient, emailPatient,
			telephonePatient, cellphonePatient, dateConsult, hourIniConsult,
			hourEndConsult FROM consults WHERE dateConsult BETWEEN '#{weekStart}'
			AND '#{weekEnd}';"					
	end
end 
