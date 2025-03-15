from django.urls import path
from . import views


urlpatterns = [
  path('addcourse', views.add_course, name='add_course'),
  path('courselist', views.list_course, name='list_course'),
   # path('',views.myIndex, name='index'),
   # path('',views.HelloAPiView.as_view(),name='index'),
   #0302lab2
   #path('add', views.add_post, name='add_post'),
   #path('list',views.list_post, name='list_post'),
  #mySQL
  #  path('users',views.list_users,name='lisr_user'),

]