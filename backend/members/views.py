# Rest FrameWork
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action

# Model and Serializer
from .models import Members
from .serializers import MembersSerializer

# Filter and Pagination
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination

# Authentication
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from rest_framework.permissions import IsAuthenticated


class Paginate(PageNumberPagination):
    """
Custom pagination class for controlling the number of items per page in the API response.

Attributes:
    page_size (int): The default number of items per page.
    page_size_query_param (str): The query parameter to specify the number of items per page.
"""
    page_size = 10
    page_size_query_param = "page_size"


class MemberViewSet(viewsets.ModelViewSet):
    """
A viewset for handling CRUD operations and custom actions related to the 'Members' model.

Attributes:
    queryset (QuerySet): A queryset containing all instances of the 'Members' model.
    serializer_class (Serializer): The serializer class used for serializing 'Members' instances.
    filter_backends (list): A list of filter backends applied to the viewset.
    search_fields (list): A list of fields on which search filtering is applied.
    pagination_class (Pagination): The pagination class used for paginating the response.
    authentication_classes (list): A list of authentication classes applied to the viewset.

Methods:
    create: Custom method for creating a new member instance.
    update: Custom method for updating an existing member instance.
    destroy: Custom method for deleting a member instance.
    gender_choices: Custom action to retrieve the gender choices available for members.
    plan_choices: Custom action to retrieve the plan choices available for members.
"""
    queryset = Members.objects.all()
    serializer_class = MembersSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "email", "phone_number"]
    pagination_class = Paginate
    authentication_classes = [JWTTokenUserAuthentication]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User updated successfully", "data": serializer.data}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = instance.name
        instance.delete()
        return Response(
            {"message": f"The user with name '{name}' deleted successfully"}
        )

    @action(detail=False, methods=["get"])
    def gender_choices(self, request):
        return Response(Members.GENDER_CHOICES)

    @action(detail=False, methods=["get"])
    def plan_choices(self, request):
        return Response(Members.PLAN_CHOICES)
