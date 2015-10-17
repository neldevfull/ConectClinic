Rails.application.routes.draw do
  # Root
  root "login#index"
  
  # Patients
  resources :patients, only: [:create, :update]
  get "patients" => "patients#index", as: :index_patients
  get "patient"  => "patients#new", as: :new_patient
  get "patient/:id/edit" => "patients#edit", as: :edit_patient
  get "patients/main/:limit/:offset" => "patients#main", as: :main_patients
  get "patients/amount" => "patients#amount", as: :amount_patients
  get "patients/patients" => "patients#patients", as: :names_patients 
  
  # Consults
  resources :consults, only: [:index, :create, :update] 
  
  #Insurance
  resources :insurances, only: [:index, :create, :edit, :update] 
  get "insurances" => "insurances#index", as: :index_insurances
  get "insurance"  => "insurances#new", as: :new_insurance
end