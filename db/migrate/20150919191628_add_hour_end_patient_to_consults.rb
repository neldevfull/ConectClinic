class AddHourEndPatientToConsults < ActiveRecord::Migration
  def change
    add_column :consults, :hourEndPatient, :string
  end
end
