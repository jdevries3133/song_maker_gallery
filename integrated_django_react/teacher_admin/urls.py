from teacher_admin.views import TeacherViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', TeacherViewSet, basename='Teacher')
urlpatterns = router.urls