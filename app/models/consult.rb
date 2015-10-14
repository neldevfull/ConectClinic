#encoding: utf-8  
class Consult < ActiveRecord::Base
	belongs_to :patient

	#Validation of fields	
	validates :date, mask: "9999-99-99", if: :date?
	validates :hour_ini, mask: "99:99", if: :hour_ini?
	validates :hour_end, mask: "99:99", if: :hour_end?
	validate  :hour_equal?, if: :hour_ini?, if: :hour_end?

	validates_presence_of :date
	validates_presence_of :hour_ini
	validates_presence_of :hour_end
	# Validates that hours are equal
	def hour_equal?		
		if self.hour_ini == self.hour_end
			self.errors.add(:hour_end, 'não é valido')
		end		
	end

	# def getConsults(weekStart, weekEnd)			
	# 	result = getConnect().select_all 
	# 		"SELECT pa.id, pa.name, pa.email, pa.telephone,
	# 		pa.cellphone, pa.gender, pa.mail_accept,
	# 		co.date, co.hour_ini, co.hour_end  
	# 		FROM patients pa
	# 		JOIN consults co
	# 		ON pa.id = co.patient_id 
	# 		WHERE co.date 
	# 		BETWEEN '#{weekStart}' AND '#{weekEnd}';"
	# end

	# private

	# def getConnect
	# 	return ActiveRecord::Base.connection
	# end	

end 