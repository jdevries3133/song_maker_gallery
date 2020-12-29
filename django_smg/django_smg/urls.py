from django.contrib import admin
from django.urls import path, include
from .views import loginRedirect

urlpatterns = [
    path('api/auth/', include('accounts.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('admin/', admin.site.urls),
    path('accounts/login/', loginRedirect),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', include('frontend.urls')),
]
