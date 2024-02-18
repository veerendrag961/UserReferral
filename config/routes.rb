Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'registrations',
    sessions: 'sessions'
  }

  devise_scope :user do
    get 'profile', to: 'sessions#profile'
  end

  post 'referrals/send_email', to: 'referrals#send_referral_email'
  get 'referrals/referral_users', to: 'referrals#referral_users'
  
  get 'up', to: 'rails/health#show', as: :rails_health_check

  root 'home#index'
end
