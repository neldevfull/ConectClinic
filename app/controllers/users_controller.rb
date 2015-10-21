# Requires
require 'main_module'

class UsersController < ApplicationController
	# Includes
	include MainModule

	def index
		@users = get_all_users()
	end

	def new
		@user = User.new
	end

	def create
		@user = User.new user_params
		if @user.save
			render :json => {
				:response => success_message('salvar', 'Usuario'),
				:verb     => 'post',
				:fail     => false
			}
		else
			render :json => {
				:response => errors_message(@user),
				:verb     => 'post',
				:fail     => true
			}
		end
	end

	def edit
		@user = get_user()
	end

	def update
		@user = get_user()
		if @user.update user_params
			render :json => { 
				:response => success_message('atualizar', 'Usuario'),
				:verb     => 'put',
				:fail     => false
			}
		else
			render :json => {
				:response => errors_message(@user),
				:verb     => 'post',
				:fail     => true
			}
		end
	end

	private

	def get_user
		User.find(params[:id])
	end

	def get_all_users
		User.select("id", "name", "email",
			"career", "gender", "privilege",
			"status")
	end

	def user_params
		params.require(:user)
			.permit(:id, :name, :email, :password,
				:password_confirmation, :career, 
				:gender, :privilege, :status)
	end

end
