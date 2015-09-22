class FixHourEndConsult < ActiveRecord::Migration
  def change
  	rename_column :consults, :hourEndPatient, :hourEndConsult   	
  end
end
