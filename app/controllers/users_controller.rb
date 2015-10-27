# Requires
require 'main_module'
require 'user_module'

class UsersController < ApplicationController
	# Includes
	include MainModule
	include UserModule

	# Authentication
	before_action :require_authentication, only: [:create, :update, 
		:index, :new, :edit]

	def index
		@users = get_all_users()
	end

	def new
		@user = User.new
	end

	def create
		verb = "post"
		answers = params[:user][:answers].split(",")
		career  = params[:user][:career]
		if accepts_answers?(career, answers)
			User.transaction do
				@user = User.new user_params
				if @user.save
					answers.each do |answer|
						new_answer = Answer.new(healtcare_id: answer, 
							secretary_id: @user.id)
						unless new_answer.save
							raise ActiveRecord::Rollback
							render_response(errors_message(new_answer),
								verb, true)									
						end
					end
					render_response(success_message('salvar', 'Usuario'),
						verb, false)
				else
					render_response(errors_message(@user),
						verb, true)
				end
			end
		else
			render_response("Profissional da saude nao pode recepcinar",
				verb, true)
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

	def allhealthcare
		allhealthcare = get_all_healthcare()
		if allhealthcare
			render :json => {
				:response => allhealthcare,
				:verb     => 'get',
				:error    => true
			}
		else
			render :json => {
				:response => "Error",
				:verb     => 'get',
				:error    => false
			}
		end
	end

	private

	def get_all_healthcare
		User.select("id", "name")
			.where("career = 'healthcare'")
			.order("name ASC")
	end

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
