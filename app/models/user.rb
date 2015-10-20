class User < ActiveRecord::Base
	# Relationships
	has_many :answers

	# Passw secure
	has_secure_password
end
