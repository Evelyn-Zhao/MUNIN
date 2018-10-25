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

def getDataList(request):
    data = Data.objects.all()
    
    a = []
    for d in data:
        item = d.__dict__
        if "_state" in item:
            del item["_state"]
        print(item)
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
    #print(data)
    #print(urlname)
    #print(download_file_name)
    #print(os.path.join(settings.DATA_DIRS, urlname))
    #print(os.path.join(settings.DOWNLOAD_DIRS,download_file_name))
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
        exp = Experiment.objects.filter(expid = id).values()[0]
    
        data = exp
        experimeters = []
        datainfo=[]

        #get each experimenter's details
        for exper in exp["experimenters"]:
            user = Users.objects.filter(usrname = exper).values()[0]
            experimeters.append(user['usrfirstname']+" "+user['usrlastname'])
        data["experimenters"] = experimeters

        #get each data details
        for dataele in data["generated_data"]:
            datalist = {}
            d = Data.objects.filter(dataid = dataele).values()[0]
            datalist["dataid"] = dataele
            datalist["datadescription"] = d["datadescription"]
            datainfo.append(datalist)
        data["generated_data"] = datainfo
        return JsonResponse(data)
    except Exception as e:
        print("error occurred")
        return JsonResponse({'error': 'experiment does not exist, please check the file system.'})

def getAllMyExp(request):
    if 'usrname' in request.session:
        myexps = []
        #TODO: get user's experiment list by querying the TABLE userexperiment
        exps = UserExperiment.objects.filter(usrid = Users.objects.filter(usrname = request.session['usrname']).first()).values()
        for exp in exps:
            print(exp)
            #when junction object is created, require to pass the whole object (FK) into the query
            #when junction object is retrieved, only the id of FK object is returned
            #wired!
            print(exp['expid_id'])
            exp_object = Experiment.objects.filter(expid = exp['expid_id']).first()
            #TODO: When the retrieved objects are not serialisable?
            exp_object = exp_object.__dict__
            if "_state" in exp_object:
                del exp_object["_state"]
            print(exp_object)
            myexps.append(exp_object)
        
        #for jsonfile in glob.glob(settings.EXP_DIRS+'/*.json'):
        #    print(jsonfile)
        #    with open(jsonfile, encoding='utf-8', mode='r') as f:
        #        data = json.load(f)
        #        for experimenter in data["experimenters"]:
        #            if experimenter == request.session['usrname']:
        #                myexps.append(data)
    return JsonResponse({'myexps': myexps})

def claim(request):
    #Add experimenter's name into experimenter list
    #Also add one object in userexperiment table

    id = request.GET['id']
    tmp = {}
    if 'usrname' in request.session:
        exptoclaim = Experiment.objects.filter(expid = id).values()[0]
        for exper in exptoclaim['experimenters']:
        #with open(settings.EXP_DIRS+'/Exp_'+str(id)+'.json', mode='r') as f:
        #    data = json.load(f)
            user_exist = False
            #for exp in data["experimenters"]:
            for exp in exper:
                if exp == request.session['usrname']:
                    user_exist = True
                    
            if user_exist:
                return JsonResponse({'message': 'You are already the experimenter of this experiment'})
            else:
                tmp = exptoclaim['experimenters']
                tmp.append(request.session['usrname'])
                exptoclaim['experimenters'] = tmp

                #data["experimenters"].append(request.session['usrname'])
                #tmp = data
        #with open(settings.EXP_DIRS+'/Exp_'+str(id)+'.json', mode='w') as outfile:
        #    json.dump(tmp, outfile)
        #TODO: provide a feedback message for claiming successfully
                return JsonResponse({'message': 'Claim Successfully'})


def getAllClaimableExp(request):
    #TODO: only experiments with valide json exp file can be presented
    cexps = []
    claimableExps = Experiment.objects.filter(exptype = "Available").values()
    for claimableExp in claimableExps:
        print(claimableExp)
        cexps.append(claimableExp)
    return JsonResponse({'cexps': cexps})


def manageExpDetail(request):
    #if 'usrname' in request.session:
    return JsonResponse({'error': 'error occurred'})

#not fully implemented, need to call the user table and exp_relation table 
def getExperimentList(request):
    a = []
    explist = Experiment.objects.filter(deleted = False).values()
    for exp in explist:
        a.append(exp)
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
        #exp = Experiment.objects.create(expname = request.POST["expname"], exptype = request.POST["exptype"], 
        #                                expstartd = request.POST["expstartd"], expendd = request.POST["expendd"], 
        #                                expdescription = request.POST["expdescription"], experimenters = json_object["experimenters"], 
        #                                related_exps = [], generated_data=[], outcomes = [])
        exp = Experiment(expname = request.POST["expname"], exptype = request.POST["exptype"], 
                                        expstartd = request.POST["expstartd"], expendd = request.POST["expendd"], 
                                        expdescription = request.POST["expdescription"], experimenters = json_object["experimenters"], 
                                        related_exps = [], generated_data=[], outcomes = [])
        exp.save()
        #for each experiment and experimenter pair, create a relationship
        for ele in json_object["experimenters"]:
            UserExperiment.objects.create(expid = exp, usrid = Users.objects.filter(usrname = ele).first())
        print(json_object)
    except Exception as e:
        print(e)
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
    #print(request.data)
    #request.read()
    #data = json.loads(request.body)
    json_object = {
        
        "username": request.POST["username"],
        "password": request.POST["password"],
        
    }
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

