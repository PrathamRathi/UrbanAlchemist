from django.urls import path
from .import views

app_name = "main"

urlpatterns = [
    path("", views.traffic_request, name="traffic_request")
]