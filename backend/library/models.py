from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import os


def book_image_path(instance, filename):
    return os.path.join("book_images", filename)


class Category(models.Model):
    """
    A model representing a category for books.

    Attributes:
        name (CharField): The name of the category.
        created_at (DateTimeField): The date and time when the category was created.
        created_by (ForeignKey): The user who created the category.

    Methods:
        __str__: Returns the name of the category as a string.
    """

    name = models.CharField(max_length=100, verbose_name="Category Name")
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Created By"
    )

    def __str__(self):
        return self.name


class Book(models.Model):
    """
    A model representing a book.

    Attributes:
        category (ForeignKey): The category to which the book belongs.
        created_by (ForeignKey): The user who created the book.
        name (CharField): The name of the book.
        author (CharField): The author of the book.
        quantity (PositiveIntegerField): The quantity of the book available.
        image (ImageField): The image of the book.
        is_best_selling (BooleanField): Indicates if the book is a best seller.
        created_at (DateTimeField): The date and time when the book was created.

    Methods:
        __str__: Returns the name of the book as a string.
        clean: Validates the book instance, ensuring quantity is not negative.
    """

    BEST_SELLING_CHOICES = [
        (True, "Yes"),
        (False, "No"),
    ]

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        verbose_name="Category",
        related_name="books",
    )
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Created By"
    )
    name = models.CharField(max_length=100, verbose_name="Book Name")
    author = models.CharField(max_length=100, verbose_name="Author")
    quantity = models.PositiveIntegerField(verbose_name="Quantity")
    image = models.ImageField(
        upload_to=book_image_path, blank=True, null=True, verbose_name="Image"
    )
    is_best_selling = models.BooleanField(
        default=False, choices=BEST_SELLING_CHOICES, verbose_name="Best Selling"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    def __str__(self):
        return self.name

    def clean(self):
        if self.quantity < 0:
            raise ValidationError("Quantity cannot be negative.")
