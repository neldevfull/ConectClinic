class AddIndex < ActiveRecord::Migration
  def change
  	add_index :patients, :insurance_id, :name => 'idx_insurance_id'
  	add_index :consults, :patient_id, :name => 'idx_patient_id'	
  end
end