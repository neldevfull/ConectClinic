class AddCellphonePatientToConsults < ActiveRecord::Migration
  def change
    add_column :consults, :cellphonePatient, :string
  end
end
