Rails.application.routes.draw do
  root "patients#index"  
  resources :patients, only: [:new, :create, :destroy, :edit, :update]
  get "patients/search" => "patients#search", as: :search_patient
end
