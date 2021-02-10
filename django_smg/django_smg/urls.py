from django.contrib import admin
from django.urls import path, include
from .views import (
    loginRedirect,
    robots,
    sitemap
)

from accounts.views import pw_reset_placeholder

urlpatterns = [
    path('robots.txt', robots),
    path('sitemap.xml', sitemap),
    path('api/auth/', include('accounts.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('smgadministrator/', admin.site.urls),
    path('accounts/login/', loginRedirect),
    path('accounts/password_reset/', pw_reset_placeholder),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', include('frontend.urls')),
]
