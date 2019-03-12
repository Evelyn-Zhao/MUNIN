from django.urls import path, re_path

from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('index', views.index, name = 'index'),
    path('service-worker.js', views.index, name = 'service_worker_js'),

    
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('register', views.register, name='register'),
    path('me', views.me, name='me'),
    path('exp', views.getExperimentList, name = 'exp'),
    path('expdetails', views.getExpDetails, name = 'expdetails'),
    path('data', views.getDataList, name = 'data'),
    path('datadetails', views.getDataDetails, name = 'datadetails'),
    path('newexp', views.newexp, name='newexp'),
    path('downloadData', views.downloadData, name = 'downloadData'),
    path('claimableExps', views.getAllClaimableExp, name = 'claimableExps'),
    path('myExps', views.getAllMyExp, name = 'myExps'),
    path('claimExp', views.claim, name = 'claimExp'),
    path('showPersonalInfo', views.showPersonalInfo, name = 'showPersonalInfo'),
    path('updatePersonalInfo', views.updatePersonalInfo, name = 'updatePersonalInfo'),
    path('getAllUsers', views.getAllUsers, name = 'getAllUsers'),
    path('getAllExp', views.getAllExp, name = 'getAllExp'),
    path('getAllEquip', views.getAllEquip, name = 'getAllEquip'),
    path('upload', views.upload, name = 'upload'),
    re_path('^.*$', views.index, name = 'index'),
    #path('add/',views.add, name='add'),
    #path('add2/<int:a>/<int:b>/',views.old_add2_redirect),
    #path('new_add2/<int:a>/<int:b>/', views.add2, name='add2'),
    #path('renderAdd/', views.renderAdd, name='renderAdd'),
    #path('', views.index, name='index'),
]