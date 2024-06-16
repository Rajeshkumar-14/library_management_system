from django.db import models
from django.utils import timezone
from library.models import Book
from members.models import Members


class LibraryManagement(models.Model):
    """
    A model representing the management of library book borrowings by members.

    Attributes:
        user (ForeignKey): A foreign key to the Members model representing the member who borrowed the book.
        book (ForeignKey): A foreign key to the Book model representing the book that was borrowed.
        issued_date (DateField): The date when the book was borrowed.
        return_date (DateField): The date when the book is expected to be returned.
        late_fee (DecimalField): The late fee incurred if the book is returned after the due date.
        is_returned (BooleanField): Indicates if the book has been returned.
        late_fee_paid (BooleanField): Indicates if the late fee has been paid.

    Methods:
        __str__: Returns a string representation of the LibraryManagement instance.
        calculate_late_fee: Calculates the late fee based on the return date and user's plan.
        transfer_late_fee_to_unpaid_fines: Transfers the late fee to the member's unpaid fines if not paid.
        update_member_late_return_count: Updates the member's late return count if the book is returned late.
        save: Custom save method to handle late fee calculation, updating member details, and saving the instance.

    Meta:
        verbose_name_plural: Plural name for the model in the Django admin interface.
    """

    user = models.ForeignKey(
        Members,
        on_delete=models.CASCADE,
        verbose_name="Member",
        related_name="borrowed_books",
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        verbose_name="Book",
        related_name="borrowed_books",
    )
    issued_date = models.DateField(auto_now_add=True, verbose_name="Borrowed Date")
    return_date = models.DateField(blank=True, null=True, verbose_name="Return Date")
    late_fee = models.DecimalField(
        default=0.00, max_digits=10, decimal_places=2, verbose_name="Late Fee"
    )
    is_returned = models.BooleanField(default=False, verbose_name="Is Returned")
    late_fee_paid = models.BooleanField(default=False, verbose_name="Late Fee Paid")

    def __str__(self):
        return f"{self.user} - {self.book.name}"

    def calculate_late_fee(self):
        """Calculate the late fee for the book borrowing based on the return date and the user's plan.

        If the return date is provided, the method calculates the difference in days between the return date and the issued date.
        If the difference is greater than 30 days, an extra fee is calculated based on the user's plan:
            - For 'Student' plan: $10 per day
            - For 'Normal' plan: $20 per day
            - For 'Premium' plan: $10 per day
            - For any other plan: no daily fee
        The total late fee is the product of the extra days and the daily fee determined by the user's plan.
        If the return date is not provided, the late fee is set to 0.

        Returns:
            None
        """
        if self.return_date:
            return_date_diff = self.return_date - self.issued_date
            if return_date_diff.days > 30:
                extra_days = return_date_diff.days - 30
                # Determine late fee based on user's plan
                if self.user.plan == "Student":
                    daily_fee = 10
                elif self.user.plan == "Normal":
                    daily_fee = 20
                elif self.user.plan == "Premium":
                    daily_fee = 10
                else:
                    daily_fee = 0

                self.late_fee = extra_days * daily_fee
            else:
                self.late_fee = 0
        else:
            self.late_fee = 0

    def transfer_late_fee_to_unpaid_fines(self):
        """
        Transfers the late fee amount to the member's unpaid fines if the late fee has not been paid.

        If the late fee has been paid, the member's unpaid fine is set to 0.
        If the late fee has not been paid, the late fee amount is added to the member's unpaid fines.

        Returns:
            None
        """
        if self.late_fee_paid:
            self.user.unpaid_fine = 0
        else:
            self.user.unpaid_fine += self.late_fee

        self.user.save()

    def update_member_late_return_count(self):
        """
        Updates the late return count for the member if the book is returned late.

        If the return date is provided, the method calculates the difference in days between the return date and the issued date.
        If the difference is greater than 30 days, the late return count for the member is incremented by 1.

        Returns:
            None
        """
        if self.return_date:
            return_date_diff = self.return_date - self.issued_date
            if return_date_diff.days > 30:
                self.user.late_return_count += 1
                self.user.save()

    def save(self, *args, **kwargs):
        """
        Saves the LibraryManagement instance with additional functionality for handling late fees, member details, and instance saving.

        If the book is marked as returned and the return date is not set, it sets the return date to the current date and calculates the late fee.
        Calculates the late fee for the borrowing.
        If the instance is new (not yet saved), updates the member's late return count.
        Transfers the late fee to the member's unpaid fines.
        Calls the parent class save method to save the instance.

        Parameters:
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            None
        """
        if self.is_returned and not self.return_date:
            self.return_date = timezone.now().date()
            self.calculate_late_fee()

        self.calculate_late_fee()

        if not self.pk:
            self.update_member_late_return_count()

        self.transfer_late_fee_to_unpaid_fines()

        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Library Management"
