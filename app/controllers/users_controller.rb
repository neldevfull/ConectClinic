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
	# User Session
	before_action :get_healthcare_to_user, :get_user_current,
		only: [:index, :new, :edit]		

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
						new_answer = Answer.new(healthcare_id: answer, 
							user_id: @user.id)
						unless new_answer.save
							render_response(errors_message(new_answer),
								verb, true)									
							raise ActiveRecord::Rollback
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
		verb = 'put'
		answers  = params[:user][:answers].split(",")
		removers = params[:user][:removers].split(",")
		career   = params[:user][:career]		
		if accepts_answers?(career, answers)
			User.transaction do
				@user = get_user()
				if @user.update user_params	
					if removers.count > 0
						# Delete Answers
						answers_removers = answers_removers(
							removers, @user.id)					
					end
					if answers.count > 0
						# Insert Answers
						success = true				
						answers.each do |answer|
							already_exist = answers_already_exist?(answer, @user.id)
							unless already_exist.present?
								new_answer = Answer.new(healthcare_id: answer, 
									user_id: @user.id)
								unless new_answer.save
									success = false
									rollback()
								end
							end
						end
						unless success						
							render_response(errors_message(new_answer),
								verb, true)									
							rollback()
						end
					end
					render_response(success_message('salvar', 'Usuario'),
						verb, false)
				else
					render_response(errors_message(@user),
						verb, true)
					rollback()
				end
			end
		else
			render_response("Profissional da saude nao pode recepcinar",
				verb, true)
		end		
	end

	# All healthcare for New action
	def allhealthcare
		allhealthcare = get_all_healthcare()
		if allhealthcare
			render_response(allhealthcare,
				'get', false)
		else
			render_response('Error',
				'get', true)
		end
	end

	# Healthcare no belonging for Edit action
	def healthcarenobelonging
		healthcare_no_belonging = 
			User.new.get_healthcare_no_belonging(params[:id])
		if healthcare_no_belonging
			render_response(healthcare_no_belonging,
					'get', false)
		else
			render_response("Error",
				'get', false)
		end
	end

	def answers				
		answers = get_answers(params[:id])
		if answers
			render_response(answers, 'get', false)
		else
			render_response(
				"Erro ao buscar profissionais da saude",
				'get', true)
		end
	end

	private

	def rollback
		raise ActiveRecord::Rollback
	end

	def answers_already_exist?(healthcare_id, user_id)
		Answer.where(healthcare_id: healthcare_id,
			user_id: user_id)
	end

	def get_answers(id)
		User.select("id", "name")
			.joins("JOIN answers ON users.id = 
			answers.healthcare_id")
			.where("answers.user_id = #{id}")
			.order("name ASC")
	end

	def answers_removers(removers, user_id)
		Answer.where(:healthcare_id => removers,
			user_id: user_id).destroy_all
	end

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
