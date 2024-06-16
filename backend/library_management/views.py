# Rest FrameWork
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action

from datetime import timedelta
from django.utils import timezone
from django.db.models import Count

# Model and Serializer
from .models import LibraryManagement
from .serializers import LibraryManagementSerializer
from members.models import Members
from library.models import Book, Category

# Filter and Pagination
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination

# Authentication
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class Paginate(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"


class LibraryManagementViewSet(viewsets.ModelViewSet):
    """
    Class representing a ViewSet for managing library book issues and statistics.

    Attributes:
        queryset: Queryset containing all LibraryManagement objects.
        serializer_class: Serializer class for LibraryManagement objects.
        filter_backends: List of filter backends used for searching.
        search_fields: List of fields to search on.
        pagination_class: Class for pagination settings.
        authentication_classes: List of authentication classes used.

    Methods:
        create: Create a new book issue record after validating user and plan limits.
        update: Update an existing book issue record.
        destroy: Delete a book issue record.
        initial_counts: Get counts of issued, returned books, total books, and members.
        book_counts: Get counts of issued, returned, total, and not returned books.
        member_counts: Get counts of total, normal, premium, and student members.
        insight: Get insights on most borrowed books in the current week, month, and overall.
    """

    queryset = LibraryManagement.objects.all()
    serializer_class = LibraryManagementSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["user__name", "book__name", "borrow_date", "return_date"]
    pagination_class = Paginate
    authentication_classes = [JWTTokenUserAuthentication]

    def create(self, request, *args, **kwargs):
        """
        Create a new book issue record after validating user and plan limits.

        Parameters:
            request (Request): The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response indicating the success or failure of the operation.

        Raises:
            HTTP_400_BAD_REQUEST: If the user does not exist, has unpaid fees, or has reached the maximum books limit.
            HTTP_201_CREATED: If the book issue record is created successfully.
        """
        # Extract user_id from the request data
        user_id = request.data.get("user_name")

        # Check if the user exists
        try:
            user = Members.objects.get(id=user_id)
        except Members.DoesNotExist:
            return Response(
                {"message": "User does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if the user has any unpaid fees pending
        if user.unpaid_fine > 0:
            return Response(
                {"message": "User has unpaid fees pending. Cannot issue a new book."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check the number of books issued to the user based on their plan
        issued_books_count = LibraryManagement.objects.filter(
            user=user, is_returned=False
        ).count()

        # Define the maximum number of books allowed based on the user's plan
        if user.plan == "Student":
            max_books_allowed = 8
        elif user.plan == "Normal":
            max_books_allowed = 5
        elif user.plan == "Premium":
            max_books_allowed = 10
        else:
            max_books_allowed = 0  # Default to 0 if plan is not recognized

        # Validate the number of books issued
        if issued_books_count >= max_books_allowed:
            return Response(
                {
                    "message": f"Maximum books limit ({max_books_allowed}) reached for the user's plan."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Proceed with creating the book issue record
        request_data = request.data.copy()
        request_data.pop(
            "issued_date", None
        )  # Remove issued_date from the request data if present

        serializer = self.get_serializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Book issue record created successfully",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Update an existing book issue record.

        Parameters:
            request (Request): The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response indicating the success or failure of the operation.

        Raises:
            HTTP_400_BAD_REQUEST: If the data provided in the request is invalid.
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Book Issue record updated successfully",
                    "data": serializer.data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a book issue record.

        Parameters:
            request (Request): The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response indicating the success or failure of the operation.
        """
        instance = self.get_object()
        user_name = instance.user.name
        book_name = instance.book.name
        instance.delete()
        return Response(
            {
                "message": f"The Book Issue record for user '{user_name}' and with Book name '{book_name}' deleted successfully"
            }
        )

    @action(detail=False, methods=["get"])
    def initial_counts(self, request):
        """
        Get counts of issued, returned books, total books, and members.

        Parameters:
            self: The object instance.
            request (Request): The HTTP request object.

        Returns:
            Response: The HTTP response containing counts of issued, returned books, total books, and members.

        Raises:
            N/A
        """
        issued_books_count = LibraryManagement.objects.filter(is_returned=False).count()
        returned_books_count = LibraryManagement.objects.filter(
            is_returned=True
        ).count()
        total_books_count = Book.objects.count()
        total_members_count = Members.objects.count()

        return Response(
            {
                "issued_books_count": issued_books_count,
                "returned_books_count": returned_books_count,
                "total_books_count": total_books_count,
                "total_members_count": total_members_count,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"])
    def book_counts(self, request):
        """
        Get counts of issued, returned, total, and not returned books.

        Parameters:
            self: The object instance.
            request (Request): The HTTP request object.

        Returns:
            Response: The HTTP response containing counts of issued, returned, total, and not returned books.

        Raises:
            N/A
        """
        issued_books_count = LibraryManagement.objects.all().count()
        returned_books_count = LibraryManagement.objects.filter(
            is_returned=True
        ).count()
        total_books_count = Book.objects.count()
        not_returned_books_count = LibraryManagement.objects.filter(
            is_returned=False
        ).count()

        return Response(
            {
                "issued_books_count": issued_books_count,
                "returned_books_count": returned_books_count,
                "total_books_count": total_books_count,
                "not_returned_books_count": not_returned_books_count,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"])
    def member_counts(self, request):
        """
        Get counts of total, normal, premium, and student members.

        Parameters:
            self: The object instance.
            request (Request): The HTTP request object.

        Returns:
            Response: The HTTP response containing counts of total, normal, premium, and student members.

        Raises:
            N/A
        """
        total_member_count = Members.objects.count()
        normal_member_count = Members.objects.filter(plan="Normal").count()
        premium_member_count = Members.objects.filter(plan="Premium").count()
        student_member_count = Members.objects.filter(plan="Student").count()
        return Response(
            {
                "total_member_count": total_member_count,
                "normal_member_count": normal_member_count,
                "premium_member_count": premium_member_count,
                "student_member_count": student_member_count,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"])
    def insight(self, request):
        """
        Get insights on most borrowed books in the current week, month, and overall.

        Parameters:
            self: The object instance.
            request (Request): The HTTP request object.

        Returns:
            Response: The HTTP response containing the most borrowed books in the current week, month, and overall.

        Raises:
            N/A
        """
        start_of_week = timezone.now() - timedelta(days=timezone.now().weekday())
        end_of_week = start_of_week + timedelta(days=6)

        # Get the start and end date of the current month
        start_of_month = timezone.now().replace(day=1)
        end_of_month = start_of_month + timedelta(days=31)

        # Query for the most borrowed book in the current week
        most_borrowed_books_week = (
            LibraryManagement.objects.filter(
                issued_date__range=[start_of_week, end_of_week]
            )
            .values("book__name")
            .annotate(num_borrowed=Count("book"))
            .order_by("-num_borrowed")[:5]
        )

        # Query for the most borrowed book in the current month
        most_borrowed_books_month = (
            LibraryManagement.objects.filter(
                issued_date__range=[start_of_month, end_of_month]
            )
            .values("book__name")
            .annotate(num_borrowed=Count("book"))
            .order_by("-num_borrowed")[:5]
        )

        # Query for the most borrowed book overall
        most_borrowed_books_overall = (
            LibraryManagement.objects.values("book__name")
            .annotate(num_borrowed=Count("book"))
            .order_by("-num_borrowed")[:3]
        )

        # Construct the response data
        response_data = {
            "topBooksWeek": list(most_borrowed_books_week),
            "topBooksMonth": list(most_borrowed_books_month),
            "topBooksAllTime": list(most_borrowed_books_overall),
        }
        return Response(response_data, status=status.HTTP_200_OK)
