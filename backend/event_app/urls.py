from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, UserViewSet, OnesEventsAPIView, MyEventListAPIView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'events', EventViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path(r"users/me/events/", MyEventListAPIView.as_view())
]