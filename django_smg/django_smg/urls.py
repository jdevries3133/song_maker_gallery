from django.contrib import admin
from django.urls import path, include
from .views import loginRedirect

urlpatterns = [
    # accounts
    path('api/auth/', include('accounts.urls')),
    # galleries
    path('api/gallery/', include('gallery.urls')),
    # admin
    path('admin/', admin.site.urls),
    # password reest & redirect back to frontend
    path('accounts/login/', loginRedirect),
    path('accounts/', include('django.contrib.auth.urls')),
    # frontend (consider future decoupling)
    path('', include('frontend.urls')),
]
