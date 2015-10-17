class CreateInsurances < ActiveRecord::Migration
  def change
    create_table :insurances do |t|
      t.string :identifier, default: ''
      t.string :name, null: false
      t.string :city, default: ''
      t.string :state, default: ''
      t.integer :status, default: 1

      t.timestamps null: false
    end
  end
end
