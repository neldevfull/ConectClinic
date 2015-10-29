class CreateAnswers < ActiveRecord::Migration
  def change
    create_table :answers, id: false do |t|
      t.integer :healthcare_id
      t.integer :user_id

      t.timestamps null: false
    end
    # Create Composite Primary Key
    execute "ALTER TABLE answers ADD CONSTRAINT pk_healthcare_user_id_answers
    	PRIMARY KEY (healthcare_id, user_id);"
    # Create Foreign Key healthcare_id
    execute "ALTER TABLE answers ADD CONSTRAINT fk_healthcare_id_answers
    	FOREIGN KEY(healthcare_id) REFERENCES users(id);"
    # Create Foreign Key
    execute "ALTER TABLE answers ADD CONSTRAINT fk_user_id_answers
    	FOREIGN KEY(user_id) REFERENCES users(id);"
  end
end
