Rails.application.routes.draw do
  root "patients#index"  
  resources :patients, only: [:new, :create, :destroy, :edit, :update]
end
