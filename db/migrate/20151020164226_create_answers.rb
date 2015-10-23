class CreateAnswers < ActiveRecord::Migration
  def change
    create_table :answers, id: false do |t|
      t.integer :healtcare_id, references: [:User, :id],
        foreign_key: true
      t.integer :secretary_id, references: [:User, :id],
        foreign_key: true

      t.timestamps null: false
    end
  end
end
