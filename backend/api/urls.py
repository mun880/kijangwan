from django.urls import path, include
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

urlpatterns = [
    # Auth
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('driver/register/', DriverRegisterView.as_view(), name='driver_register'),
    path('passenger/register/', PassengerRegisterView.as_view(), name='passenger_register'),
    path('stats/', StatsView.as_view(), name='stats'),
    
    # API
    path('', include(router.urls)),
]
