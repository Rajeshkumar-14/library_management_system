from django.contrib import admin

# Book and Category Model
from .models import Book, Category

# Member Model
from members.models import Members

# Library Management Model
from library_management.models import LibraryManagement


# Register Book and Category Model.
class BookAdmin(admin.ModelAdmin):
    """
    Admin class for managing Book model in the Django admin panel.

    Attributes:
        list_display (tuple): A tuple of fields to display in the list view of Book model.
        list_filter (tuple): A tuple of fields to enable filtering in the admin panel.
        search_fields (tuple): A tuple of fields to enable search functionality in the admin panel.

    """

    list_display = ("name", "author", "quantity", "category", "is_best_selling")
    list_filter = ("category", "is_best_selling")
    search_fields = ("name", "author")


class CategoryAdmin(admin.ModelAdmin):
    """
    Admin class for managing Category model in the Django admin panel.

    Attributes:
        list_display (tuple): A tuple of fields to display in the list view of Category model.
        search_fields (tuple): A tuple of fields to enable search functionality in the admin panel.
        filter_input_length (dict): A dictionary specifying the minimum input length for filtering fields.

    """

    list_display = ("name", "created_at")
    search_fields = ("name",)
    filter_input_length = {"name": 3}


admin.site.register(Book, BookAdmin)
admin.site.register(Category, CategoryAdmin)


# Register Members Model.
class MembersAdmin(admin.ModelAdmin):
    """
    Admin class for managing Members model in the Django admin panel.

    Attributes:
        list_display (tuple): A tuple of fields to display in the list view of Members model.
        list_filter (tuple): A tuple of fields to enable filtering in the admin panel.
        search_fields (tuple): A tuple of fields to enable search functionality in the admin panel.
        filter_input_length (dict): A dictionary specifying the minimum input length for filtering fields.

    """

    list_display = (
        "name",
        "email",
        "phone_number",
        "plan",
        "address",
        "gender",
        "is_active",
        "late_return_count",
        "unpaid_fine",
    )
    list_filter = ("plan", "gender", "is_active")
    search_fields = ("name", "email", "phone_number")
    filter_input_length = {"name": 3, "email": 3, "phone_number": 3}


admin.site.register(Members, MembersAdmin)


# Register Library Management Model.
class LibraryManagementAdmin(admin.ModelAdmin):
    """
    Admin class for managing LibraryManagement model in the Django admin panel.

    Attributes:
        list_display (tuple): A tuple of fields to display in the list view of LibraryManagement model.
        list_filter (tuple): A tuple of fields to enable filtering in the admin panel.
        search_fields (tuple): A tuple of fields to enable search functionality in the admin panel.
        filter_input_length (dict): A dictionary specifying the minimum input length for filtering fields.

    """

    list_display = (
        "user",
        "book",
        "issued_date",
        "return_date",
        "late_fee",
        "is_returned",
        "late_fee_paid",
    )
    list_filter = ("is_returned", "late_fee_paid")
    search_fields = ("user__name", "book__name", "issued_date", "return_date")
    filter_input_length = {"user__name": 3, "book__name": 3, "book__author": 3}


admin.site.register(LibraryManagement, LibraryManagementAdmin)
