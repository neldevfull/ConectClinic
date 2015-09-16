Rails.application.routes.draw do
  # Routes for Patients
  root "patients#index"  
  resources :patients, only: [:new, :create, :destroy, :edit, :update]
  get "patients/search" => "patients#search", as: :search_patient
  # Routes for Consults
  resources :consults, only: [:new, :create, :destroy, :edit, :updte] 
end
