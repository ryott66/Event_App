
from django.contrib import admin
from django.urls import path
from django.urls import include, path
from event_app.views import EmailTokenObtainPairView, CustomTokenRefreshView


urlpatterns = [
    path(r'admin/', admin.site.urls),
    path(r'api/', include("event_app.urls")),
    path(r'api-auth/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path(r'api-auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'), 
]
