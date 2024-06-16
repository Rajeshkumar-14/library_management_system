from django.db import models
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__)


class Members(models.Model):
    """
    A model representing members in the system.

    Attributes:
        name (CharField): The name of the member.
        email (EmailField): The email address of the member.
        phone_number (CharField): The phone number of the member.
        plan (CharField): The membership plan of the member.
        address (CharField): The address of the member.
        gender (CharField): The gender of the member.
        is_active (BooleanField): Indicates if the member is active.
        late_return_count (IntegerField): The count of late returns by the member.
        unpaid_fine (DecimalField): The amount of unpaid fines by the member.
        created_at (DateTimeField): The timestamp when the member was created.
        updated_at (DateTimeField): The timestamp when the member was last updated.
        created_by (ForeignKey): The user who created the member.

    Methods:
        __str__: Returns the name of the member.
        save: Custom save method to log the change in 'is_active' field before and after saving.
    """

    PLAN_CHOICES = [
        ("Student", "Student"),
        ("Normal", "Normal"),
        ("Premium", "Premium"),
    ]
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]
    name = models.CharField(
        max_length=100, null=False, blank=False, unique=True, verbose_name="Name"
    )
    email = models.EmailField(
        null=False, blank=False, unique=True, verbose_name="Email"
    )
    phone_number = models.CharField(
        max_length=10, null=False, blank=False, unique=True, verbose_name="Phone Number"
    )
    plan = models.CharField(max_length=10, choices=PLAN_CHOICES, verbose_name="Plan")
    address = models.CharField(max_length=200, verbose_name="Address")
    gender = models.CharField(
        max_length=10, verbose_name="Gender", choices=GENDER_CHOICES
    )
    is_active = models.BooleanField(default=True, verbose_name="Is Active")
    late_return_count = models.IntegerField(default=0, verbose_name="Late Return Count")
    unpaid_fine = models.DecimalField(
        default=0.00, max_digits=10, decimal_places=2, verbose_name="Previous Fine"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At")
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Created By", default=1
    )

    def __str__(self):
        return self.name
