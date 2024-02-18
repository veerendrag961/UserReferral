class SessionsController < Devise::SessionsController
  respond_to :json

  def create
    resource = User.find_for_database_authentication(email: params[:user][:email])
    if resource && resource.valid_password?(params[:user][:password])
      sign_in(resource_name, resource)
      token = generate_jwt_token(resource)
      render json: { message: "Logged in successfully", user: resource, token: token }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def profile
    user = current_user
    if user
      render json: { user: "User Profile", user: user, token: generate_jwt_token(user) }
    else
      render json: { error: "User not found." }, status: 404
    end
  end
end
