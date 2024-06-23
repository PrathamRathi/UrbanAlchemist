from django.urls import path
from .import views

app_name = "main"

urlpatterns = [
    path("traffic_request/", views.traffic_request),
    path("model_analysis/", views.model_analysis)
]