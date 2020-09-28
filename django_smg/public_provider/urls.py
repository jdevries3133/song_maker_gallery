from django.urls import path
from . import views

urlpatterns = [
  path('<str:gallery_name>/', views.gallery)
]