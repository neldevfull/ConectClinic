class CreateConsults < ActiveRecord::Migration
  def change
    create_table :consults do |t|
      t.string :typeConsult
      t.string :namePatient
      t.string :TellephonePatient
      t.string :emailPatient
      t.string :agreement
      t.string :dateConsult
      t.string :hourConsult
      t.string :obsConsult

      t.timestamps null: false
    end
  end
end
