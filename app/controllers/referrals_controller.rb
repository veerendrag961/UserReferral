class ReferralsController < ApplicationController
  def send_referral_email
    user = current_user
    if user
      email = params[:email]
      if User.exists?(email: email) || Referral.find_by(email: email) 
        render json: { error: "User already registered" }, status: :unprocessable_entity
      else
        Referral.create(user: user, email: email)
        ReferralMailer.referral_email(email, root_url).deliver_now
        render json: { message: 'Referral email sent successfully' }, status: :ok
      end
    else
      render json: { error: 'Invalid details' }, status: :bad_request
    end
  end

  def referral_users
    user = current_user
    if user
      render json: { message: 'Referral list', referrals: user.referrals }, status: :ok
    else
      render json: { error: 'Invalid details' }, status: :bad_request
    end
  end
end
