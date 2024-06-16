from rest_framework import serializers
from .models import LibraryManagement
from library.serializers import CategorySerializer
import datetime


class DateToDateField(serializers.DateField):
    """
    Custom Date field serializer that converts datetime objects to date objects for representation and internal value.

    Attributes:
        serializers.DateField: A field serializer from Django REST framework for handling date fields.

    Methods:
        to_representation(self, value): Converts datetime objects to date objects for representation.
        to_internal_value(self, data): Converts datetime objects to date objects for internal value.
    """

    def to_representation(self, value):
        """
        Converts a datetime object to a date object for representation.

        Parameters:
            value (datetime.datetime): The datetime object to be converted.

        Returns:
            date: The date object representation of the input datetime object.
        """
        if isinstance(value, datetime.datetime):
            value = value.date()
        return super().to_representation(value)

    def to_internal_value(self, data):
        """
        Converts a datetime object to a date object for internal value.

        Parameters:
            data (datetime.datetime): The datetime object to be converted.

        Returns:
            date: The date object representation of the input datetime object.
        """
        if isinstance(data, datetime.datetime):
            data = data.date()
        return super().to_internal_value(data)


class LibraryManagementSerializer(serializers.ModelSerializer):
    """
    Serializer class for LibraryManagement model.

    Attributes:
        user_name (ReadOnlyField): A read-only field to represent the user's name.
        book_name (ReadOnlyField): A read-only field to represent the book's name.
        issued_date (DateToDateField): A custom date field serializer for the issued date.
        return_date (DateToDateField): A custom date field serializer for the return date.

    Meta:
        model (LibraryManagement): The model associated with the serializer.
        fields (str): Indicates that all fields from the model should be included in the serializer.

    """

    user_name = serializers.ReadOnlyField(source="user.name")
    book_name = serializers.ReadOnlyField(source="book.name")
    issued_date = DateToDateField(read_only=True)
    return_date = DateToDateField(allow_null=True, required=False)

    class Meta:
        """
        Meta options for the LibraryManagementSerializer class.

        Attributes:
            model (LibraryManagement): The model associated with the serializer.
            fields (str): Indicates that all fields from the model should be included in the serializer.
        """

        model = LibraryManagement
        fields = "__all__"
