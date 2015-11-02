#encoding: utf-8

# Requires
require 'validations'

class User < ActiveRecord::Base
	# Includes
	include Validations

	# Relationships
	has_many :answers

	# Passw secure
	has_secure_password

	# Constants
	BLANK_ERROR    = "nao pode ficar em branco"

	# Authenticate
	def self.authenticate(email, password)
		user = self.find_by(email: email)
		if user.present? && 
			user.status == "Ativo"
			user.authenticate(password)			
		end
	end

	# Validate User
	validates_uniqueness_of :email
	
	validate do |user|
		# Validate Name
		unless is_present?(user.name)
			errors.add :name, BLANK_ERROR
		else
			if minimum?(user.name, 3)
				errors.add :name, minimum_error(3)
			else
				string_regex(:name)
			end
		end
		
		#Validate E-mail
		unless is_present?(user.email)
			errors.add :email, BLANK_ERROR
		else
			if minimum?(user.email, 6)
				errors.add :email, minimum_error(6)
			else
				email_regex(:email)
			end
		end
		
		# Validate Password and Confirmation
		if is_present?(user.password)						
			if is_present?(user.password_confirmation)
				passw_regex(:password)
				passw_regex(:password_confirmation)
			end
		end
		
		# Validate Gender
		unless is_present?(user.gender)
			errors.add :gender, BLANK_ERROR
		else
			if user.gender != "male" &&
				user.gender != "female"
				errors.add :gender, "nao e valido"
			end
		end
		
		# Validate Privilege
		unless is_present?(user.privilege)
			errors.add :privilege, BLANK_ERROR
		else
			if user.privilege != 1 && user.privilege != 0
				errors.add :privilege, "nao e valido"
			end
		end

		# Validate Career
		if user.career != "healthcare" &&
			user.career != "secretary"
			errors.add :career, "nao e valido"
		end

	end

	# Data Access Object
	def get_healthcare_no_belonging(id)
		connect = get_connection()
 		connect.select_all "SELECT id, name FROM users
 			WHERE id != #{id} AND career = 'healthcare'
 			AND id NOT IN (SELECT healthcare_id FROM answers
 					WHERE user_id = #{id})"
	end

	def get_healthcare_belonging(user)
		connect = get_connection()
		connect.select_all "SELECT * FROM users
			WHERE career = 'healthcare'
			AND id IN (SELECT healthcare_id FROM answers
				WHERE user_id = #{user.id})"
	end
	
	private 

	def get_connection
		conn = ActiveRecord::Base.connection
	end
	
end
