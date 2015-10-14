class CreatePatients < ActiveRecord::Migration
  def change
    create_table :patients do |t|
      t.integer :insurance_id, foreign_key: true
      t.string :name
      t.string :email
      t.string :telephone
      t.string :cellphone
      t.string :birth
      t.string :gender
      t.integer :mail_accept
      t.integer :status, default: 1      

      t.timestamps null: false
    end
  end
end
