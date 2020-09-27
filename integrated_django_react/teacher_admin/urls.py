from teacher_admin.api import TeacherViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', TeacherViewSet, basename='teacher')
urlpatterns = router.urls
