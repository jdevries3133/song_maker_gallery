from django.urls import path

from .views import index

urlpatterns = [
    path('', index),
    path('gallery/', index),
    path('signup/', index),
    path('login/', index)
]