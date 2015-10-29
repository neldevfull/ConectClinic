class Answer < ActiveRecord::Base
	# Primary Keys
	self.primary_keys = :healthcare_id, :user_id

	# Relationships
	belongs_to :user

end
