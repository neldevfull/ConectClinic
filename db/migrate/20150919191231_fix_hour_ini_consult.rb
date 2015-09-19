class FixHourIniConsult < ActiveRecord::Migration
  def change
  	rename_column :consults, :hourConsult, :hourIniConsult
  end
end
