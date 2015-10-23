class AddIndex < ActiveRecord::Migration
  def change
  	# Consults
  	add_index :consults, :insurance_id, name: "idx_insurance_id"
  	add_index :consults, :patient_id,   name: "idx_patient_id"

  	# Answers
  	add_index :answers, :healtcare_id, name: "idx_healtcare_id"
  	add_index :answers, :secretary_id, name: "idx_secreatary_id" 
  end
end
