from django.urls import path, include
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
    return Response({
        'auth_token': reverse('token_obtain_pair', request=request, format=format),
        'auth_token_refresh': reverse('token_refresh', request=request, format=format),
        'driver_register': reverse('driver_register', request=request, format=format),
        'passenger_register': reverse('passenger_register', request=request, format=format),
        'stats': reverse('stats', request=request, format=format),
        'drivers': reverse('driver-list', request=request, format=format),
        'routes': reverse('route-list', request=request, format=format),
        'vehicles': reverse('vehicle-list', request=request, format=format),
        'schedules': reverse('schedule-list', request=request, format=format),
        'logs': reverse('systemlog-list', request=request, format=format),
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
