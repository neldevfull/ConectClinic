class UserSessionsController < ApplicationController

	def new
		@user_session = UserSession.new(session)
	end

	def create
		@user_session = UserSession.new(session, 
			params[:user_session])

		if @user_session.authenticate!
			render :json => {
				:response => "",
				:action   => "authenticate",
				:fail     => false
			}
		else
			render :json => {
				:response => "Credenciais nao conferem",
				:action   => 'authenticate',
				:fail     => true
			}		
		end

	end

	def destroy

	end

	private 

	# def user_session_params
	# 	params.require[:user_session]
	# 		.permit(:email, :password)
	# end

end
