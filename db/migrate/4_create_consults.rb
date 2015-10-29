class CreateConsults < ActiveRecord::Migration
  def change
    create_table :consults do |t|
      t.integer :patient_id, null: false
      t.integer :insurance_id, null: false
      t.string  :date, null: false
      t.string  :hour_ini, null: false
      t.string  :hour_end, null: false  
      t.integer :confirm, default: 0
      t.string  :scheduling, default: ""
      t.string  :obs, default: ""
      t.integer :status, default: 1  

      t.timestamps null: false
    end
    # Create Foreign Key healthcare_id
    execute "ALTER TABLE consults ADD CONSTRAINT pk_patient_id_consults
      FOREIGN KEY(patient_id) REFERENCES patients(id);"
    # Create Foreign Key
    execute "ALTER TABLE consults ADD CONSTRAINT pk_insurance_id_consults
      FOREIGN KEY(insurance_id) REFERENCES insurances(id);"
  end
end
