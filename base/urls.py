from django.contrib import admin
from django.urls import path
from . import views
from .views import CustomTokenObtainPairView
urlpatterns = [
    path('', views.index),
    path('login/', CustomTokenObtainPairView.as_view()),
]
