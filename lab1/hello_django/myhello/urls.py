from django.urls import path
from . import views


urlpatterns = [
   # path('',views.myIndex, name='index'),
    path('',views.HelloAPiView.as_view(),name='index'),
]