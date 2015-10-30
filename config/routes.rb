Rails.application.routes.draw do
  # Root
  root "home#home"

  # Users
  resources :users, only: [:create, :update]
  get "users" => "users#index", as: :index_users
  get "user"  => "users#new", as: :new_user
  get "user/:id/edit" => "users#edit", as: :edit_user
  # Get all healthcare
  get "allhealthcare" => "users#allhealthcare",
    as: :all_healthcare
  get "user/:id/allhealthcare" => "users#healthcarenobelonging",
    as: :healthcare_belonging    
  # Get answers
  get "user/:id/answers" => "users#answers",
    as: :answers

  # UserSession
  resource :user_sessions, only: [:create, :destroy]
  get "login" => "user_sessions#new", as: :new_user_sessions
  
  # Patients
  resources :patients, only: [:create, :update]
  get "patients" => "patients#index", as: :index_patients
  get "patient"  => "patients#new", as: :new_patient
  get "patient/:id/edit" => "patients#edit", as: :edit_patient
  get "patients/main/:limit/:offset" => "patients#main", as: :main_patients
  get "patients/amount" => "patients#amount", as: :amount_patients
  get "patients/patients" => "patients#patients", as: :names_patients 
  
  # Consults
  resources :consults, only: [:create, :update]
  get "consults/:user" => "consults#index",
    as: :index_consults 
  get "consults" => "consults#agenda",
    as: :agenda_consults
  get "consults/:user/patients/patients" => "patients#patients", 
    as: :consults_allpatients
  get "consults/:user/allinsurances" => "insurances#allinsurances",
    as: :consults_allinsurances
  
  #Insurances
  resources :insurances, only: [:create, :update] 
  get "insurances" => "insurances#index", as: :index_insurances
  get "insurance"  => "insurances#new", as: :new_insurance
  get "insurance/:id/edit" => "insurances#edit", as: :edit_insurance
  get "insurances/main/:limit/:offset" => "insurances#main", as: :main_insurances
  get "insurances/amount" => "insurances#amount", as: :amount_insurances
  get "allinsurances" => "insurances#allinsurances", as: :all_insurances

end