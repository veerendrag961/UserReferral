class RegistrationsController < Devise::RegistrationsController
  respond_to :json
  after_action :check_referrals, only: [:create]

  def create
    if sign_up_params[:password] != sign_up_params[:password_confirmation]
      render json: { error: "Password and password confirmation do not match" }, status: :unprocessable_entity
    else
      existing_user = User.find_by(email: params[:user][:email])

      if existing_user
        render json: { error: 'Email already registered' }, status: :unprocessable_entity
      else
        super do |user|
          @user = user
        end
      end
    end
  end

  private

  def check_referrals
    referral_user = Referral.find_by(email: @user&.email)
    return unless referral_user

    referral_user.update(verified: true) if referral_user
  end
  
  protected

  def respond_with(resource, _opts = {})
    render json: resource
  end

  def respond_to_on_destroy
    head :no_content
  end
end
