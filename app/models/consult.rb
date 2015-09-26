class Consult < ActiveRecord::Base

	def getConsults(weekStart, weekEnd)			
		result = getConnect().select_all "SELECT id, namePatient, emailPatient,
			telephonePatient, cellphonePatient, dateConsult, hourIniConsult,
			hourEndConsult FROM consults WHERE dateConsult BETWEEN '#{weekStart}'
			AND '#{weekEnd}';"					
	end

	private

	def getConnect
		return ActiveRecord::Base.connection
	end

end 