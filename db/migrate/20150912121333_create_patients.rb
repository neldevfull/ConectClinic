class CreatePatients < ActiveRecord::Migration
  def change
    create_table :patients do |t|      
      t.string :name, null: false
      t.string :email, default: ''
      t.string :telephone, default: ''
      t.string :cellphone, default: ''
      t.string :birth, default: ''
      t.string :gender, null: false
      t.integer :mail_accept, default: ''
      t.integer :status, default: 1      

      t.timestamps null: false
    end
  end
end
