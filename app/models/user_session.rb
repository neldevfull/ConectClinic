class UserSession
	# Includes
	include ActiveModel::Model

	# Attributes
	attr_accessor :email, :password

	# Validation
	validates_presence_of :email, :password

	# Initialize
	def initialize(session, attributes = {})
		@session = session
		@email   = attributes[:email]
		@password   = attributes[:password]
	end

	# Autheticate!
	def authenticate!
		user = User.authenticate(@email, @password)

		if user.present?
			store(user)
			true
		else
			errors.add(:base, "Login invalido")
			false
		end
	end

	# Store User
	def store(user)
		@session[:user_id] = user.id
	end

end
