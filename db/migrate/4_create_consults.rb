class CreateConsults < ActiveRecord::Migration
  def change
    create_table :consults do |t|
      t.integer :healthcare_id, null: false
      t.integer :secretary_id, default: 0
      t.integer :patient_id, null: false
      t.integer :insurance_id, default: 0
      t.string  :date, null: false
      t.string  :hour_ini, null: false
      t.string  :hour_end, null: false  
      t.integer :confirm, default: 0
      t.string  :scheduling, default: ""
      t.string  :obs, default: ""
      t.integer :status, default: 1  

      t.timestamps null: false
    end
  end
end
 