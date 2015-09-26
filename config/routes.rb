Rails.application.routes.draw do
  # Routes for Patients
  root "patients#index"  
  resources :patients, only: [:new, :create, :destroy, :edit, :update]
  get "patients/search" => "patients#search", as: :search_patient
  get "patients/patients" => "patients#patients", as: :names_patients 
  # Routes for Consults
  resources :consults, only: [:index, :create, :destroy, :update]  
end