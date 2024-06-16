import random
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
import logging
from django.contrib.sessions.models import Session

logger = logging.getLogger(__name__)

from .serializers import (
    CustomTokenObtainPairSerializer,
    GetUserDataSerializer,
    PasswordResetConfirmSerializer,
    RegisterSerializer,
    ChangePasswordSerializer,
    UpdateUserSerializer,
    PasswordResetSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Class to customize the JWT token generation process by using a custom serializer.
    """

    serializer_class = CustomTokenObtainPairSerializer


class GetUserData(APIView):
    """
    Class representing a view to retrieve data of the authenticated user.

    Attributes:
        permission_classes (list): A list containing the permission classes required for this view.

    Methods:
        get(self, request): Handles the GET request to retrieve data of the authenticated user.
            Args:
                request (Request): The HTTP request object.
            Returns:
                Response: The HTTP response containing the serialized data of the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handles the GET request to retrieve data of the authenticated user.

        Args:
            request (Request): The HTTP request object.

        Returns:
            Response: The HTTP response containing the serialized data of the authenticated user.
        """
        user = request.user
        serializer = GetUserDataSerializer(user)
        return Response(serializer.data)

    def users(request):
        return Response(User.objects.all())


class RegisterView(generics.CreateAPIView):
    """
    Class representing a view for user registration.

    Attributes:
        permission_classes (tuple): A tuple containing the permission classes required for this view.
        queryset (QuerySet): A QuerySet containing all User objects.
        serializer_class (Serializer): The serializer class used for user registration.

    Methods:
        post(self, request): Handles the POST request to register a new user.
            Args:
                request (Request): The HTTP request object containing user registration data.
            Returns:
                Response: The HTTP response indicating the status of the registration process.
    """

    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ChangePasswordView(generics.UpdateAPIView):
    """
    Class representing a view for changing the password of an authenticated user.

    Attributes:
        serializer_class (Serializer): The serializer class used for changing the password.
        model (Model): The User model.
        permission_classes (list): A list containing the permission classes required for this view.

    Methods:
        get_object(self, queryset=None): Retrieves the authenticated user object.
        update(self, request, *args, **kwargs): Handles the update request to change the user's password.
            Args:
                request (Request): The HTTP request object containing the new password data.
                *args: Additional positional arguments.
                **kwargs: Additional keyword arguments.
            Returns:
                Response: The HTTP response indicating the status of the password update process.
    """

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        user = self.request.user
        logger.debug(f"Authenticated user: {user}")
        return user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        logger.debug(f"Received request data: {request.data}")
        logger.debug(f"Request headers: {request.headers}")
        logger.debug(f"User: {user}")
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            logger.debug("Serializer valid, updating password")
            serializer.save()
            return Response(
                {"detail": "Password updated successfully"}, status=status.HTTP_200_OK
            )
        logger.debug(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateProfileView(generics.UpdateAPIView):
    """
    Class representing a view for updating the profile of an authenticated user.

    Attributes:
        queryset (QuerySet): A QuerySet containing all User objects.
        permission_classes (list): A list containing the permission classes required for this view.
        serializer_class (Serializer): The serializer class used for updating the user profile.

    Methods:
        update(self, request, *args, **kwargs): Handles the update request to modify the user's profile.
            Args:
                request (Request): The HTTP request object containing the updated profile data.
                *args: Additional positional arguments.
                **kwargs: Additional keyword arguments.
            Returns:
                Response: The HTTP response indicating the status of the profile update process.
    """

    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateUserSerializer

    def update(self, request, *args, **kwargs):
        logger.debug(f"Received request data: {request.data}")
        return super().update(request, *args, **kwargs)


class LogoutView(APIView):
    """
    Class representing a view for logging out a user by blacklisting the refresh token.

    Attributes:
        permission_classes (tuple): A tuple containing the permission classes required for this view.

    Methods:
        post(self, request): Handles the POST request to blacklist the refresh token and log out the user.
            Args:
                request (Request): The HTTP request object containing the refresh token.
            Returns:
                Response: The HTTP response indicating the status of the logout process.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Handles the POST request to blacklist the refresh token and log out the user.

        Args:
            request (Request): The HTTP request object containing the refresh token.

        Returns:
            Response: The HTTP response indicating the status of the logout process.
        """
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful."}, status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(generics.GenericAPIView):
    """
    Class representing a view for initiating the password reset process.

    Attributes:
        serializer_class (Serializer): The serializer class used for initiating the password reset.
        permission_classes (tuple): A tuple containing the permission classes required for this view.

    Methods:
        post(self, request): Handles the POST request to initiate the password reset process.
            Args:
                request (Request): The HTTP request object containing the user's email for password reset.
            Returns:
                Response: The HTTP response indicating the status of the password reset initiation process.
    """

    serializer_class = PasswordResetSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user_email = serializer.validated_data["email"]
            try:
                user = User.objects.get(email=user_email)
                otp = generate_otp()
                serializer.send_otp_email(user, otp)

                # Save the OTP to the user's session for verification later
                request.session["reset_otp"] = otp
                request.session["reset_email"] = user_email
                request.session.save()
                print(
                    "OTP and email saved in session:",
                    request.session["reset_otp"],
                    request.session["reset_email"],
                )

                # Debug logs to verify session saving
                session_key = request.session.session_key
                session = Session.objects.get(session_key=session_key)
                print("Session saved:", session.session_data)

                return Response("OTP sent to your email.", status=status.HTTP_200_OK)
            except ObjectDoesNotExist:
                return Response(
                    "User with this email does not exist.",
                    status=status.HTTP_404_NOT_FOUND,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def generate_otp():
    return str(random.randint(100000, 999999))


class PasswordResetConfirmView(APIView):
    """
    Class representing a view for confirming the password reset process.

    Attributes:
        permission_classes (tuple): A tuple containing the permission classes required for this view.

    Methods:
        post(self, request, *args, **kwargs): Handles the POST request to confirm the password reset process.
            Args:
                request (Request): The HTTP request object containing the new password and OTP for confirmation.
                *args: Additional positional arguments.
                **kwargs: Additional keyword arguments.
            Returns:
                Response: The HTTP response indicating the status of the password reset confirmation process.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        """
        Handles the POST request to confirm the password reset process.

        Args:
            request (Request): The HTTP request object containing the new password and OTP for confirmation.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: The HTTP response indicating the status of the password reset confirmation process.
        """
        session_otp = request.session.get("reset_otp")
        session_email = request.session.get("reset_email")

        serializer = PasswordResetConfirmSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Password reset successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
