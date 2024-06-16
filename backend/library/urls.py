from rest_framework import routers
from .views import BookViewSet, CategoryViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r"books", BookViewSet)
router.register(r"categories", CategoryViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
