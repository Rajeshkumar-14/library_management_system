from rest_framework import serializers
from .models import Book, Category
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model using Django REST framework.
    """

    class Meta:
        """
        Inner class to define metadata options for the CategorySerializer.

        Attributes:
            model: The model class that the serializer should use.
            fields: The fields that should be included in the serialized output.
        """

        model = Category
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    """
    Serializer for Book model using Django REST framework.
    """

    class Meta:
        """
        Inner class to define metadata options for the BookSerializer.

        Attributes:
            model: The model class that the serializer should use.
            fields: The fields that should be included in the serialized output.
        """

        model = Book
        fields = "__all__"
