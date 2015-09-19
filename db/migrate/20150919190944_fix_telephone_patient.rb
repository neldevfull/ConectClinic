class FixTelephonePatient < ActiveRecord::Migration
  def change
  	rename_column :consults, :TellephonePatient, :telephonePatient
  end
end
