Rails.application.routes.draw do
  root "patients#new"
  get  "patients" => "patients#index"  
  post "patients" => "patients#create"
end
