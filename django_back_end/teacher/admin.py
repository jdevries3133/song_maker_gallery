from django.contrib import admin
from .models import Gallery

# class GalleryAdmin(admin.ModelAdmin):
#     fieldsets = [
#         ('Galleries', {'fields': [
#             'owner',
#             'title',
#             'description',
#             'api_obj',
#         ]})
#     ]

admin.site.register(Gallery)