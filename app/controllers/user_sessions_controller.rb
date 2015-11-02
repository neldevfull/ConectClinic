class UserSessionsController < ApplicationController

	# Before action
	before_action :require_no_authentication, only: [:new, :create]
	before_action :require_authentication, only: :destroy

	def new
		@user_session = UserSession.new(session)
	end

	def create
		@user_session = UserSession.new(session, 
			params[:user_session])

		if @user_session.authenticate!
			render :json => {
				:response => "Sucesso ao autenticar",
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
		user_session.destroy
		respond_to do |format|
			format.html { 
				redirect_to new_user_sessions_path 
			}		      
		end
	end

	private 

	# def user_session_params
	# 	params.require[:user_session]
	# 		.permit(:email, :password)
	# end

end
