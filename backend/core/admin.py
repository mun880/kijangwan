from django.contrib import admin
from .models import User, DriverProfile, PassengerProfile, Vehicle, Route, Schedule, SystemLog

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')

@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'license_number', 'is_approved')
    list_filter = ('is_approved',)
    search_fields = ('full_name', 'license_number')

@admin.register(PassengerProfile)
class PassengerProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('plate_number', 'vehicle_type', 'driver', 'is_active')
    list_filter = ('is_active', 'vehicle_type')

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('start_point', 'end_point', 'distance', 'is_active')
    list_filter = ('is_active',)

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'route', 'arrival_start_time', 'days_of_week', 'is_active')
    list_filter = ('is_active',)

@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'action', 'resource')
    list_filter = ('action', 'timestamp')
    readonly_fields = ('timestamp', 'user', 'action', 'resource', 'details')