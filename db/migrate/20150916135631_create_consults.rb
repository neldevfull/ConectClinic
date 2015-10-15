class CreateConsults < ActiveRecord::Migration
  def change
    create_table :consults do |t|
      t.integer :patient_id, foreign_key: true
      t.string  :type
      t.string  :date
      t.string  :hour_ini
      t.string  :hour_end  
      t.integer :confirm, default: 0
      t.integer :status, default: 1  

      t.timestamps null: false
    end
  end
end
