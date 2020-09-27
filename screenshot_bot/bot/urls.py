from django.urls import path
from .api import incoming

urlpatterns = [
    path('incoming/', incoming)
]
