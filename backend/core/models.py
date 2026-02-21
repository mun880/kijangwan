from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        DRIVER = "DRIVER", "Driver"
        PASSENGER = "PASSENGER", "Passenger"

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.PASSENGER)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username

class DriverProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    full_name = models.CharField(max_length=255)
    national_id = models.CharField(max_length=50, unique=True)
    license_number = models.CharField(max_length=50, unique=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.full_name

class PassengerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='passenger_profile')
    full_name = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name

class Vehicle(models.Model):
    driver = models.ForeignKey(DriverProfile, on_delete=models.CASCADE, related_name='vehicles')
    plate_number = models.CharField(max_length=20, unique=True)
    vehicle_type = models.CharField(max_length=50, default="Daladala")
    capacity = models.IntegerField()
    color = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.plate_number} ({self.driver.full_name})"

class Route(models.Model):
    start_point = models.CharField(max_length=100)
    end_point = models.CharField(max_length=100)
    distance = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True) # km
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.start_point} - {self.end_point}"

class Schedule(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='schedules')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='schedules')
    arrival_start_time = models.TimeField()
    arrival_end_time = models.TimeField()
    days_of_week = models.JSONField(help_text="e.g. ['Mon', 'Tue']") # List of days
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.vehicle.plate_number} on {self.route} at {self.arrival_start_time}"
class SystemLog(models.Model):
    class Action(models.TextChoices):
        CREATE = "CREATE", "Create"
        UPDATE = "UPDATE", "Update"
        DELETE = "DELETE", "Delete"
        APPROVAL = "APPROVAL", "Approval"
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='system_logs')
    action = models.CharField(max_length=50, choices=Action.choices)
    resource = models.CharField(max_length=100) # e.g. "Driver: John Doe"
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'System'} - {self.action} on {self.resource}"

    class Meta:
        ordering = ['-timestamp']
