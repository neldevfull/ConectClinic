class FixTelephoneToPatients < ActiveRecord::Migration
  def change
  	rename_column :patients, :tellephone, :telephone
  end
end
