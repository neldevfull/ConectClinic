class CreateConsults < ActiveRecord::Migration
  def change
    create_table :consults do |t|
      t.integer :patient_id, foreign_key: true, null: false
      t.integer :insurance_id, foreign_key: true, null: false
      t.string  :date, null: false
      t.string  :hour_ini, null: false
      t.string  :hour_end, null: false  
      t.integer :confirm, default: 0
      t.string  :type, default: ''
      t.string  :obs, default: ''
      t.integer :status, default: 1  

      t.timestamps null: false
    end
  end
end
