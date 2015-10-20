class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name, null:false
      t.string :email, null:false
      t.string :password_digest, null:false
      t.string :career, null:false
      t.string :gender, null:false
      t.integer :adm, null:false
      t.integer :status, default: 1

      t.timestamps null: false
    end
  end
end
