# Rest FrameWork
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status

# Model and Serializer
from .models import Book, Category
from .serializers import BookSerializer, CategorySerializer

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
        page_size_query_param (str): The query parameter to specify the number of items per page in the API request.
    """

    page_size = 10
    page_size_query_param = "page_size"


class BookViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling CRUD operations related to the 'Book' model in the API.

    Attributes:
        queryset: A queryset that retrieves all instances of the 'Book' model.
        serializer_class: The serializer class used for serializing 'Book' model instances.
        filter_backends: A list of filter backend classes used for filtering the queryset.
        search_fields: A list of fields on which search functionality is enabled.
        pagination_class: The pagination class used for paginating the API response.
        authentication_classes: A list of authentication classes used for authenticating requests.
        permission_classes: A list of permission classes used for authorizing requests.

    Methods:
        create: Creates a new 'Book' instance.
        update: Updates an existing 'Book' instance.
        destroy: Deletes an existing 'Book' instance.
    """

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "author", "category__name"]
    pagination_class = Paginate
    authentication_classes = [JWTTokenUserAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Creates a new 'Book' instance.

        Parameters:
            request (Request): The HTTP request object containing the data for creating the book.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: A response indicating the success or failure of the creation operation.

        Raises:
            HTTP_400_BAD_REQUEST: If the data provided in the request is invalid.

        Response format:
            - HTTP 201 Created: If the book is created successfully.
                {
                    "message": "Book created successfully",
                    "data": <serialized book data>
                }
            - HTTP 400 Bad Request: If the request data is invalid.
                <error details>
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Book created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Updates an existing 'Book' instance.

        Parameters:
            request (Request): The HTTP request object containing the data for updating the book.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: A response indicating the success or failure of the update operation.

        Raises:
            HTTP_400_BAD_REQUEST: If the data provided in the request is invalid.

        Response format:
            - HTTP 200 OK: If the book is updated successfully.
                {
                    "message": "Book updated successfully",
                    "data": <serialized book data>
                }
            - HTTP 400 Bad Request: If the request data is invalid.
                <error details>
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Book updated successfully", "data": serializer.data}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Deletes an existing 'Book' instance.

        Parameters:
            request (Request): The HTTP request object.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: A response indicating the success or failure of the deletion operation.

        Response format:
            - HTTP 200 OK: If the book is deleted successfully.
                {
                    "message": "The Book with name '{name}' and author '{author}' deleted successfully"
                }
        """
        instance = self.get_object()
        name = instance.name
        author = instance.author
        instance.delete()
        return Response(
            {
                "message": f"The Book with name '{name}' and author '{author}' deleted successfully"
            }
        )


class CategoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling CRUD operations related to the 'Category' model in the API.

    Attributes:
        queryset: A queryset that retrieves all instances of the 'Category' model.
        serializer_class: The serializer class used for serializing 'Category' model instances.
        filter_backends: A list of filter backend classes used for filtering the queryset.
        search_fields: A list of fields on which search functionality is enabled.
        pagination_class: The pagination class used for paginating the API response.
        authentication_classes: A list of authentication classes used for authenticating requests.
        permission_classes: A list of permission classes used for authorizing requests.

    Methods:
        create: Creates a new 'Category' instance.
        update: Updates an existing 'Category' instance.
        destroy: Deletes an existing 'Category' instance.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    pagination_class = Paginate
    authentication_classes = [JWTTokenUserAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Creates a new 'Category' instance.

        Parameters:
            request (Request): The HTTP request object containing the data for creating the category.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: A response indicating the success or failure of the creation operation.

        Raises:
            HTTP_400_BAD_REQUEST: If the data provided in the request is invalid.

        Response format:
            - HTTP 201 Created: If the category is created successfully.
                {
                    "message": "Category created successfully",
                    "data": <serialized category data>
                }
            - HTTP 400 Bad Request: If the request data is invalid.
                <error details>
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Category created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Updates an existing 'Category' instance.

        Parameters:
            request (Request): The HTTP request object containing the data for updating the category.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: A response indicating the success or failure of the update operation.

        Raises:
            HTTP_400_BAD_REQUEST: If the data provided in the request is invalid.

        Response format:
            - HTTP 200 OK: If the category is updated successfully.
                {
                    "message": "Category updated successfully",
                    "data": <serialized category data>
                }
            - HTTP 400 Bad Request: If the request data is invalid.
                <error details>
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Category updated successfully", "data": serializer.data}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Deletes an existing 'Category' instance.

        Parameters:
            request (Request): The HTTP request object.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: A response indicating the success or failure of the deletion operation.

        Response format:
            - HTTP 200 OK: If the category is deleted successfully.
                {
                    "message": f"The Category with name '{name}' deleted successfully"
                }
        """
        instance = self.get_object()
        name = instance.name
        instance.delete()
        return Response(
            {"message": f"The Category with name '{name}' deleted successfully"}
        )
