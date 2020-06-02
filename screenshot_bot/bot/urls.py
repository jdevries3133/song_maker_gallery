from django.urls import path
from .views import screenshot_taker

urlpatterns = [
    path('take-screenshot/', screenshot_taker)
]