class CreateInsurances < ActiveRecord::Migration
  def change
    create_table :insurances do |t|
      t.integer :locale_id, foreign_key: true
      t.string :name

      t.timestamps null: false
    end
  end
end
