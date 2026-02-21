from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from core.models import DriverProfile, PassengerProfile, Vehicle, Route, Schedule, SystemLog
from .serializers import (
    UserSerializer, DriverProfileSerializer, PassengerProfileSerializer,
    VehicleSerializer, RouteSerializer, ScheduleSerializer,
    DriverRegisterSerializer, PassengerRegisterSerializer, SystemLogSerializer
)

User = get_user_model()

# Custom Token Serializer to include role
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Auth Views
class DriverRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = DriverRegisterSerializer
    permission_classes = [permissions.AllowAny]

class PassengerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = PassengerRegisterSerializer
    permission_classes = [permissions.AllowAny]

def log_action(user, action, resource, details=""):
    SystemLog.objects.create(user=user, action=action, resource=resource, details=details)

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "ADMIN"

# ViewSets

class SystemLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemLog.objects.all()
    serializer_class = SystemLogSerializer
    permission_classes = [IsAdminRole]

class DriverViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all()
    serializer_class = DriverProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return super().get_permissions()

    def perform_update(self, serializer):
        instance = serializer.save()
        status_text = "Approved" if instance.is_approved else "Pending"
        log_action(self.request.user, SystemLog.Action.APPROVAL, f"Driver: {instance.full_name}", f"Status changed to {status_text}")

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        # ... (rest of me remains same)
        if request.user.role != "DRIVER":
            return Response({"error": "Not a driver"}, status=status.HTTP_403_FORBIDDEN)
        try:
            profile = request.user.driver_profile
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except DriverProfile.DoesNotExist:
             return Response({"error": "Driver profile not found"}, status=status.HTTP_404_NOT_FOUND)

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, SystemLog.Action.CREATE, f"Route: {instance.start_point} - {instance.end_point}")

class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "DRIVER":
            return Vehicle.objects.filter(driver__user=user)
        elif user.role == "ADMIN":
            return Vehicle.objects.all()
        return Vehicle.objects.filter(is_active=True)

    def perform_create(self, serializer):
        if self.request.user.role == "DRIVER":
            instance = serializer.save(driver=self.request.user.driver_profile)
            log_action(self.request.user, SystemLog.Action.CREATE, f"Vehicle: {instance.plate_number}", "Added by Driver")
        elif self.request.user.role == "ADMIN":
             instance = serializer.save()
             log_action(self.request.user, SystemLog.Action.CREATE, f"Vehicle: {instance.plate_number}", "Added by Admin")

class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Schedule.objects.filter(is_active=True)
            
        if user.role == "DRIVER":
            return Schedule.objects.filter(vehicle__driver__user=user)
        elif user.role == "ADMIN":
            return Schedule.objects.all()
        return Schedule.objects.filter(is_active=True)
    
    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, SystemLog.Action.CREATE, f"Schedule: {instance.vehicle.plate_number}", f"Route: {instance.route}")

class StatsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == "ADMIN":
            return Response({
                "total_users": User.objects.count(),
                "active_vehicles": Vehicle.objects.filter(is_active=True).count(),
                "total_routes": Route.objects.count(),
                "pending_drivers": DriverProfile.objects.filter(is_approved=False).count(),
            })
        elif user.role == "DRIVER":
            try:
                profile = user.driver_profile
                return Response({
                    "total_trips": Schedule.objects.filter(vehicle__driver=profile).count(),
                    "active_vehicle": Vehicle.objects.filter(driver=profile, is_active=True).first().plate_number if Vehicle.objects.filter(driver=profile, is_active=True).exists() else "None",
                    "rating": 4.8,
                    "status": "Ready" if profile.is_approved else "Pending Approval"
                })
            except:
                return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"error": "No stats for this role"}, status=status.HTTP_403_FORBIDDEN)
