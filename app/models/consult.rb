class Consult < ActiveRecord::Base
	
	def getConsults(dateStart, dateEnd)			
		dateStart = dateStart.to_date.strftime('%d/%m/%Y')	
		dateEnd   = dateEnd.to_date.strftime('%d/%m/%Y') 
		conn = ActiveRecord::Base.connection
		result = conn.select_all "SELECT id, namePatient, emailPatient,
			telephonePatient, cellphonePatient, dateConsult, hourIniConsult,
			hourEndConsult FROM consults WHERE dateConsult >= '#{dateStart}'
			AND dateConsult <= '#{dateEnd}';"					
	end
end 
