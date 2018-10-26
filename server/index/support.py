from django.conf import settings
from index.models import Users, Experiment, UserExperiment
import os

def dirsCheck(path):
    if not (os.path.exists(path) and os.path.isdir(path)):
        os.makedirs(path)

def get_exp_by_id(para_expid):

    exp_object = Experiment.objects.get(expid = para_expid)
    exp_info = exp_object
    #replace each experimenter id with experimenter name
    exp_info.experimenters = get_usr_by_exp(exp_object.expid)
    #get each data details
    exp_info.generated_data = get_data_by_exp(exp_object)
    return exp_info
    
def get_usr_by_exp(para_expid):
    experimenters = []
    #when junction object is created, require to pass the whole object (FK) into the query
    #when junction object is retrieved, only the id of FK object is returned
    #wired!
    usrexps = UserExperiment.objects.filter(expid = Experiment.objects.filter(expid = para_expid).first()).values()
    for usrexp in usrexps:
        usr_object = Users.objects.get(usrname = usrexp['usrid_id'])
        experimenters.append(usr_object.usrfirstname+" "+usr_object.usrlastname)
    return experimenters

"""
@param : usrname
@type : number

@return : a list of experiment id having the usr as the experimenter
@type: list of number

"""
def get_exp_by_usr(para_usrid):
    experiments = []
    #when junction object is created, require to pass the whole object (FK) into the query
    #when junction object is retrieved, only the id of FK object is returned
    #wired!
    usrexps = UserExperiment.objects.filter(usrid = Users.objects.filter(usrname = para_usrid).first()).values()
    for usrexp in usrexps:
        exp_object = Experiment.objects.get(expid = usrexp['expid_id'])
        experiments.append(exp_object.expid)
    return experiments

def get_data_by_exp(exp_object):
    datainfo=[]
    for data_object_id in exp_object.generated_data:
        data_dicobject = {}
        data_object = Data.objects.get(dataid = data_object_id)
        #TODO: more attributes could be returned, need to be implemented
        data_dicobject["dataid"] = data_object_id
        data_dicobject["datadescription"] = data_object.datadescription
        datainfo.append(data_dicobject)
    return datainfo