
#from django.shortcuts import render
from django.http import HttpResponse
'''

# Create your views here.
def myIndex(request):
    my_name = request.GET.get('name',"CGU")
   # my_name = request.POST.get('name',"CGU")
    return HttpResponse("Hello"+my_name)
'''

#from rest_framework.views import APIView

from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.core.serializers.json import DjangoJSONEncoder
import json
import logging

from .models import coursetable
#from .models import Post
logger = logging.getLogger('django')
'''
class HelloAPiView(APIView):
    def get(self,request):
        my_name = request.GET.get('name',None)
        if my_name:
            retValue = {}
            retValue['data'] = "Hello" + my_name
            return Response(retValue,status=status.HTTP_200_0K)
        else:
            return Response(
                {"res":"parameter: name is None"},
                status = status.HTTP_400_BAD_REQUEST
            
            )
'''




@api_view(['Post'])
def add_course(request):
    department  = request.data.get('department')
    coursetitle = request.data.get('coursetitle')
    instructor = request.data.get('instructor')
  

    new_post = coursetable()
    new_post.department = department
    new_post.coursetitle = coursetitle
    new_post.instructor = instructor
    new_post.save()
        # 確保不會存入空的課程
    if not department or not coursetitle or not instructor:
        return Response({"error": "請提供完整的課程資訊"}, status=status.HTTP_400_BAD_REQUEST)

    # 檢查是否已有相同的課程，避免重複新增
    existing_course = coursetable.objects.filter(department=department, coursetitle=coursetitle, instructor=instructor).exists()
    if existing_course:
        return Response({"message": "課程已存在，未重複新增"}, status=status.HTTP_200_OK)

    # 新增課程
    coursetable.objects.create(department=department, coursetitle=coursetitle, instructor=instructor)
    
    return Response({"message": "課程已新增"}, status=status.HTTP_201_CREATED)
    '''lab02
@api_view(['GET'])
def add_course(request):
    title  = request.GET.get('title','')
    content = request.GET.get('content','')
    photo = request.GET.get('photo','')
    location = request.GET.get('location','')

    new_post = Post()
    new_post.title = title
    new_post.content = content
    new_post.photo = photo
    new_post.location = location
    new_post.save()
    
    logger.debug(" ************** myhello_api: "+title)

    if title:
        return Response({"data": title+ "insert!"}, status=status.HTTP_200_OK)
    else:
        return Response(
            {"res": "parameter: name is None"},
            status=status.HTTP_400_BAD_REQUEST
        )
        '''

#from .models import User   
@api_view(['GET'])
def list_course(request):
    posts = coursetable.objects.values('department', 'coursetitle', 'instructor')  # 只取這三個欄位
    return Response(list(posts), status=status.HTTP_200_OK)
 
"""
@api_view(['GET'])
def list_course(request):
    posts = coursetable.objects.all().values()
    #return JsonResponse(list(posts),safe=False)
    
    return Response({"data":
                         json.dumps(
                             list(posts),
                             sort_keys = True,
                             indent = 1,
                             cls = DjangoJSONEncoder)},
                        status=status.HTTP_200_OK)
   
""" 