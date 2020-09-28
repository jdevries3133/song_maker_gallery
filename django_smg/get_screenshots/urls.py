from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import ScreenshotReturn

router = DefaultRouter()
router.register(r'', ScreenshotReturn, basename="return")

urlpatterns = [
    path('', include(router.urls))
]