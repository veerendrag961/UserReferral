class ReferralMailer < ApplicationMailer
  def referral_email(email, root_url)
    @recipient_email = email
    @root_url = root_url
    mail(to: @recipient_email, subject: 'You have been referred!')
  end
end
