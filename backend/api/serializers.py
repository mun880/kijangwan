from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.models import DriverProfile, PassengerProfile, Vehicle, Route, Schedule, SystemLog

class SystemLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SystemLog
        fields = ['id', 'user', 'username', 'action', 'resource', 'details', 'timestamp']
        read_only_fields = ['user', 'timestamp']

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role']
        read_only_fields = ['role'] # Role is set during registration

class DriverProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DriverProfile
        fields = ['id', 'user', 'full_name', 'national_id', 'license_number', 'is_approved']
        # removed is_approved from read_only_fields to allow Admin updates

class PassengerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PassengerProfile
        fields = ['id', 'user', 'full_name']

class VehicleSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.full_name', read_only=True)
    
    class Meta:
        model = Vehicle
        fields = ['id', 'driver', 'plate_number', 'vehicle_type', 'capacity', 'color', 'is_active', 'driver_name']
        read_only_fields = ['driver']

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'start_point', 'end_point', 'distance', 'is_active']

class ScheduleSerializer(serializers.ModelSerializer):
    vehicle_detail = VehicleSerializer(source='vehicle', read_only=True)
    route_detail = RouteSerializer(source='route', read_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'vehicle', 'route', 'arrival_start_time', 'arrival_end_time', 'days_of_week', 'is_active', 'vehicle_detail', 'route_detail']

    def validate_days_of_week(self, value):
        if isinstance(value, str):
            return [day.strip() for day in value.split(',') if day.strip()]
        return value

# Auth Serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', '')
        )
        return user

class DriverRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(max_length=255, write_only=True)
    national_id = serializers.CharField(max_length=50, write_only=True)
    license_number = serializers.CharField(max_length=50, write_only=True)
    
    class Meta(RegisterSerializer.Meta):
        fields = RegisterSerializer.Meta.fields + ['full_name', 'national_id', 'license_number']
        
    def create(self, validated_data):
        # Extract profile data
        full_name = validated_data.pop('full_name')
        national_id = validated_data.pop('national_id')
        license_number = validated_data.pop('license_number')
        
        # Create user with DRIVER role
        user = super().create(validated_data)
        user.role = User.Role.DRIVER
        user.save()
        
        # Create profile
        DriverProfile.objects.create(
            user=user,
            full_name=full_name,
            national_id=national_id,
            license_number=license_number
        )
        return user

class PassengerRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(max_length=255, write_only=True)
    
    class Meta(RegisterSerializer.Meta):
        fields = RegisterSerializer.Meta.fields + ['full_name']
        
    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        
        user = super().create(validated_data)
        user.role = User.Role.PASSENGER
        user.save()
        
        PassengerProfile.objects.create(
            user=user,
            full_name=full_name
        )
        return user
