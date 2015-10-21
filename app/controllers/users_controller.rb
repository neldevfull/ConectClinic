# Requires
require 'main_module'

class UsersController < ApplicationController
	# Includes
	include MainModule

	def index
	end

	def new
		@user = User.new
	end

	def create
		@user = User.new user_params
		if @user.save
			render :json => {
				:response => success_message('salvar', 'Usuario'),
				:error    => false
			}
		else
			render :json => {
				:response => errors_message(@user),
				:error    => true
			}
		end
	end

	private

	def user_params
		params.require(:user)
			.permit(:id, :name, :email, :password,
				:password_confirmation, :career, 
				:gender, :privilege, :status)
	end

end
