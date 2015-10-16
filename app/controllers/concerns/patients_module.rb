module PatientsModule
	# Patient exist?
	def patient_exist?(patient_c)
		Patient.all.each do |patient|
			if patient_c.name == patient.name
				if patient_c.email == patient.email
					return patient.id
				else
					if patient_c.telephone == patient.telephone
						return patient.id
					else
						if patient_c.cellphone == patient.cellphone
							return patient.id
						end
					end
				end
			end
		end
		return 0
	end
end