from django.shortcuts import render
from django.db import connection, IntegrityError
from django.http import HttpResponse, JsonResponse
from django.http import FileResponse
from index.models import Users, Experiment, Data, UserExperiment, Outcome, Participant, ParticipantExperiment, Equipment
from django.conf import settings
from index.support import *
import json, os, glob
from pprint import pprint
import urllib
# Create your views here.

#differences between filter and get: use get when a single object will be returned, use filter when more than one object will be returned
#when is the returned object serialisable?

def getDataList(request):
    data = Data.objects.all()
    #TODO: need to rertrieve the expid outof partexp id
    a = []
    for d in data:
        item = serialise_object(d)
        a.append(item)
    return JsonResponse({ 'data': a })

def getDataDetails(request):
    return 1

def downloadData(request):
    id = request.GET['id']
    data = Data.objects.filter(dataid = id).values()[0]

    filetype = data["datatype"].lower()
    urlname = "Data_"+id+"."+filetype
    download_file_name = str(data["exp_id"])+"_"+id+"."+filetype
    full_data_path = settings.DATA_DIRS+urlname
   
    try:
        dirsCheck(full_data_path)
        file=open(full_data_path,'rb')
        response = HttpResponse(file)
        response['Content-Type']='application/octet-stream'
        response['Content-Disposition']='attachment;filename="{0}"'.format(download_file_name) 
        return response

    except Exception as e:
        print(e)


def getExpDetails(request):
    id = request.GET['id']
    try:
        data = get_exp_by_id(id)
        data = serialise_object(data)
        return JsonResponse({'data':data})
    except Exception as e:
        return JsonResponse({'error': 'experiment does not exist, please check the file system.'})

def getAllMyExp(request):

    myexps = []

    if 'usrname' in request.session:
        expids = get_exp_by_usr(request.session['usrname'])
        for id in expids:
            exp_object = Experiment.objects.get(expid = id)
            #TODO: When the retrieved objects are not serialisable?
            exp_object = serialise_object(exp_object)
            myexps.append(exp_object)
        
        return JsonResponse({'myexps': myexps})
    else:
        return JsonResponse({'message': 'Login is required'}) 

def claim(request):
    #Add experimenter's name into experimenter list
    #Also add one object in userexperiment table

    id = request.GET['id']
    tmp = {}
    if 'usrname' in request.session:
        print(request.session['usrname'])
        exptoclaim = Experiment.objects.get(expid = id)
        user_exist = False

        if exptoclaim.experimenters:
            for exper in exptoclaim.experimenters: 
                for exp in exper:
                    if exp == request.session['usrname']:
                        user_exist = True

        if user_exist:
            return JsonResponse({'message': 'You are already the experimenter of this experiment'})
        else:
            #update the experimenter data in the usr object
            tmp = exptoclaim.experimenters
            tmp.append(request.session['usrname'])
            exptoclaim.experimenters = tmp
            exptoclaim.save()
            
            #create an new object in UserExperiment table
            UserExperiment.objects.create(expid = exptoclaim, usrid = Users.objects.get(usrname = request.session['usrname']))

        #TODO: provide a feedback message for claiming successfully
        return JsonResponse({'message': 'Claim Successfully'})
    else:
        return JsonResponse({'message': 'Login is required'})

def getAllClaimableExp(request):
    #TODO: only experiments with valide json exp file can be presented
    cexps = []
    claimableExps = Experiment.objects.filter(exptype = "Available").values()
    for claimableExp in claimableExps:
        exp_object = get_exp_by_id(claimableExp['expid'])
        exp_object = serialise_object(exp_object)
        cexps.append(exp_object)

    return JsonResponse({'cexps': cexps})


def manageExpDetail(request):
    #if 'usrname' in request.session:
    return JsonResponse({'error': 'error occurred'})

#not fully implemented, need to call the user table and exp_relation table 
def getExperimentList(request):
    a = []
    explist = Experiment.objects.filter(deleted = False).values()
    for exp in explist:
        exp_object = get_exp_by_id(exp['expid'])
        exp_object = serialise_object(exp_object)
        a.append(exp_object)
    return JsonResponse({ 'exps': a })

def newexp(request):
    #expid, expname, and exptype are stored in db
    json_object = {
        "expname": request.POST["expname"],
        "exptype": request.POST["exptype"],
        "related_exps": [],
        "expstartd": request.POST["expstartd"],
        "expendd": request.POST["expendd"],
        "description": request.POST["expdescription"],
        "experimenters": [],
        "data": [],
        "outcomes": []
    }

    try:
        # split the experimenters string by comma
        experimenter_list = request.POST["expers"].split(",")
       
        # then verify whether user already exists in the db, if not create user
        for exper in experimenter_list:
            exper_names = exper.strip().split(" ")
            if Users.objects.filter(usrfirstname = exper_names[0], usrlastname = exper_names[1]).exists():
                experimenter = Users.objects.filter(usrfirstname = exper_names[0], usrlastname = exper_names[1]).values()[0]
                print("experimenter exists")
                json_object["experimenters"].append(experimenter['usrname'])
            else:
                print("experimenter does not exist")
                name = exper_names[0] + "_" + exper_names[1]
                usr = Users.objects.create(usrname = name, usrpwd = "123456",usremail = " " ,usrauthority = 1, usrfirstname = exper_names[0], usrlastname = exper_names[1])
                usr = usr.__dict__
                json_object["experimenters"].append(usr['usrname'])
        
        #create a new exp in Experiment table
        exp = Experiment(expname = request.POST["expname"], exptype = request.POST["exptype"], 
                                        expstartd = request.POST["expstartd"], expendd = request.POST["expendd"], 
                                        expdescription = request.POST["expdescription"], experimenters = json_object["experimenters"], 
                                        related_exps = [], generated_data=[], outcomes = [])
        exp.save()
        #for each experiment and experimenter pair, create a relationship
        for ele in json_object["experimenters"]:
            UserExperiment.objects.create(expid = exp, usrid = Users.objects.filter(usrname = ele).first())
        
    except Exception as e:
        return JsonResponse({'error': 'error occurred'})
    else:
        response = exp.__dict__
        if "_state" in response:
            del response["_state"]
        print(response)
        return JsonResponse(response)
    
def register(request):

    #TODO: add fisrt name and last name 
   
    json_object = {
        "username": request.POST["username"],
        "password": request.POST["password"],
        "useremail": request.POST["useremail"],
        "userfisrtname": request.POST["userfirstname"],
        "userlastname": request.POST["userlastname"],
    }

    #create an object 
    try:
        user = Users.objects.create(usrname = request.POST["username"],usrpwd = request.POST["password"],usremail = request.POST["useremail"] ,usrauthority = 1, usrfirstname = request.POST["userfirstname"], usrlastname = request.POST["userlastname"])
    except IntegrityError:
        # user already exists
        return JsonResponse({'error': 'user already exists'})
    else:
        response = user.__dict__
        if "_state" in response:
            del response["_state"]
        return JsonResponse(response)

def logout(request):
    del request.session['usrname'] 
    return JsonResponse({})

def me(request):
    if 'usrname' in request.session:
        print("session: "+request.session['usrname'])
        #TRANSFER THE CLASS INTO DICT
        user = Users.objects.filter(usrname = request.session['usrname']).values()[0]
        return JsonResponse({ 'user': user })
    else :
        return JsonResponse({})

def login(request):
    
    json_object = {
        "username": request.POST["username"],
        "password": request.POST["password"],}

    try:
        user = Users.objects.filter(usrname = request.POST["username"]).values()[0]
        print(user)
        if (user['usrpwd'] == request.POST["password"]):
            request.session['usrname'] = user['usrname']
            request.session.save()
            request.session.modified = True
            print("session: "+request.session['usrname'])
            return JsonResponse({ 'user': user })
        else: 
            return JsonResponse({'error': 'password is not correct'})
    except IndexError:
        return JsonResponse({'error': 'user is not found'})

def index(request):
    return render(request, 'index.html', {})

def service_worker_js(request):
    return render(request, 'service-worker.js', {})


def showPersonalInfo(request):
    if 'usrname' in request.session:
        print("session: "+request.session['usrname'])
        try:
            user = Users.objects.filter(usrname = request.session['usrname']).values()[0]
            return JsonResponse({ 'user': user })
        except IndexError:
            return JsonResponse({'error': 'user is not found'})
    else:
        return JsonResponse({'error': 'user is not found'})

def updatePersonalInfo(request):
    json_object = {
        "useremail": request.POST["useremail"],
        "userfisrtname": request.POST["userfirstname"],
        "userlastname": request.POST["userlastname"],
    }

    if 'usrname' in request.session:
        print("session: "+request.session['usrname'])
        try:
            
            Users.objects.filter(usrname = request.session['usrname']).values[0].update(usremail = request.POST["useremail"],usrfirstname = request.POST["userfirstname"],usrlastname = request.POST["userlastname"])
            #user = Users(usrname = request.session['usrname'])
           
           
            user = Users.objects.filter(usrname = request.session['usrname']).values[0]
            print(user)
            return JsonResponse({'user': user })
        except Exception as e:
            print(e)
            return JsonResponse({'error': 'update information was not successful'})

