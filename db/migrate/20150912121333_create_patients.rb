class CreatePatients < ActiveRecord::Migration
  def change
    create_table :patients do |t|
      t.string :name
      t.string :email
      t.string :tellephone
      t.string :cellphone
      t.string :birth
      t.string :gender
      t.integer :mailAccept

      t.timestamps null: false
    end
  end
end
