class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # Delegate
  delegate :current_user, :user_session_present?, to: :user_session

  # Create new instance
  def user_session
    UserSession.new(session)
  end

  # Get healthcare beloging to secretary
  def get_answers_to_user
    @user    = current_user()
    @answers = User.new.get_healthcare_belonging(@user)
  end

  # Check if user is authenticated
  def require_authentication
    unless user_session_present?
	  respond_to do |format|
		  format.html { 
            redirect_to new_user_sessions_path, 
			  alert: "Credenciais nao informadas" 
		  }		      
       end
	end
  end

  # Check if user is already logged in
  def require_no_authentication 
    if user_session_present?
	    respond_to do |format|
	      format.html { 
		    redirect_to root_path, 
		    alert: "Usuario logado" 
	     }		      
	    end
	  end
  end

end
