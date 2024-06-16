from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    GetUserData,
    LogoutView,
    PasswordResetConfirmView,
    PasswordResetView,
    RegisterView,
    ChangePasswordView,
    UpdateProfileView,
)

urlpatterns = [
    path("signin/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"), # POST
    path("signin/refresh/", TokenRefreshView.as_view(), name="token_refresh"), # POST
    path("signup/", RegisterView.as_view(), name="register"), # POST
    path('user/', GetUserData.as_view(), name='get_user_data'),
    path("password-reset/", PasswordResetView.as_view(), name="password_reset"), # POST
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),# POST
    path('change_password/', ChangePasswordView.as_view(), name='change-password'), #PUT
    path('update_profile/<int:pk>/', UpdateProfileView.as_view(), name='update_profile'), # PUT
    path('logout/', LogoutView.as_view(), name='logout'), # POST
]
