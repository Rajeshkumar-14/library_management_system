from celery import shared_task
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.html import strip_tags


def send_password_reset_otp(email, otp):
    user = User.objects.get(email=email)
    subject = "OTP for Password Reset"

    html_message = render_to_string("email/password-reset-mail.html", {"otp": otp})
    from_email = "noreply@example.com"
    plain_message = strip_tags(html_message)
    user_email = user.email
    recipient_list = [user_email]
    send_mail(
        subject, plain_message, from_email, recipient_list, html_message=html_message
    )

    print("Password reset OTP successfully sent")


def password_reset_successfull(email):
    user = User.objects.get(email=email)
    subject = "Password Reset Successful"

    html_message = render_to_string("email/password-reset-success.html", {})
    from_email = "noreply@example.com"
    plain_message = strip_tags(html_message)
    user_email = user.email
    recipient_list = [user_email]
    send_mail(
        subject,
        plain_message,
        from_email,
        recipient_list,
        html_message=html_message,
        fail_silently=True,
    )

    print("Password reset OTP successfully sent")
