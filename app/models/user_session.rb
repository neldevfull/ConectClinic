class UserSession
	# Includes
	include ActiveModel::Model

	# Attributes
	attr_accessor :email, :password

	# Validation
	validates_presence_of :email, :password

	# Initialize
	def initialize(session, attributes = {})
		@session  = session
		@email    = attributes[:email]
		@password = attributes[:password]
	end

	# Autheticate!
	def authenticate!
		user = User.authenticate(@email, @password)

		if user.present?
			store(user)
			true
		else
			false
		end
	end

	# Store User
	def store(user)
		@session[:user_id] = user.id
	end

	# Current User
	def current_user
		User.find(@session[:user_id])
	end

	def healthcare_to_user	
		results  = User.new.get_healthcare_belonging(
			current_user)

		results.each do |result|
			answer = User.new result
			@answers << answer
		end
	end

	# User signed in?
	def user_session_present?
		@session[:user_id].present?
	end

	# Destroy session
	def destroy
		@session[:user_id] = nil
	end

end
