from django.urls import path, include, NoReverseMatch
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, DriverRegisterView, PassengerRegisterView,
    DriverViewSet, RouteViewSet, VehicleViewSet, ScheduleViewSet, StatsView,
    SystemLogViewSet
)

router = DefaultRouter()
router.register(r'drivers', DriverViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'schedules', ScheduleViewSet, basename='schedule')
router.register(r'logs', SystemLogViewSet, basename='systemlog')

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    def safe_reverse(name):
        try:
            return reverse(name, request=request, format=format)
        except NoReverseMatch:
            return None

    return Response({
        'auth_token': safe_reverse('token_obtain_pair'),
        'auth_token_refresh': safe_reverse('token_refresh'),
        'driver_register': safe_reverse('driver_register'),
        'passenger_register': safe_reverse('passenger_register'),
        'stats': safe_reverse('stats'),
        'drivers': safe_reverse('driverprofile-list'),
        'routes': safe_reverse('route-list'),
        'vehicles': safe_reverse('vehicle-list'),
        'schedules': safe_reverse('schedule-list'),
        'logs': safe_reverse('systemlog-list'),
    })

urlpatterns = [
    path('', api_root, name='api_root'),

    # Auth
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('driver/register/', DriverRegisterView.as_view(), name='driver_register'),
    path('passenger/register/', PassengerRegisterView.as_view(), name='passenger_register'),
    path('stats/', StatsView.as_view(), name='stats'),
    
    # API resources
    path('', include(router.urls)),
]
