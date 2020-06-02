from django.urls import path
from .api import screenshot_taker

urlpatterns = [
    path('take-screenshot/', screenshot_taker),
]