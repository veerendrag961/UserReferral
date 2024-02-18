class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  private

  def current_user
    bearer_token = request.headers['Authorization'].split(' ').last
    user_id = decode_jwt_token(bearer_token)['user_id']
    User.find(user_id)
  end

  def decode_jwt_token(token)
    JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
  end
  
  def generate_jwt_token(user)
    JWT.encode({ user_id: user.id }, Rails.application.secrets.secret_key_base)
  end
end
