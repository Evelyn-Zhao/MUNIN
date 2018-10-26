from django.conf import settings
from index.models import Users, Experiment, UserExperiment, ParticipantExperiment, Data
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
    usrexps = UserExperiment.objects.filter(expid = Experiment.objects.get(expid = para_expid)).values()
    for usrexp in usrexps:
        usr_object = Users.objects.get(usrname = usrexp['usrid_id'])
        experimenters.append(usr_object.usrfirstname+" "+usr_object.usrlastname)
    return experimenters

   
def get_exp_by_usr(para_usrid):

    """
    this function is used for returning the user object according to the expid
    @param : usrname
    @type : number

    @return : a list of experiment id having the usr as the experimenter
    @type: list of number

    """
    experiments = []
    #when junction object is created, require to pass the whole object (FK) into the query
    #when junction object is retrieved, only the id of FK object is returned
    #wired!
    usrexps = UserExperiment.objects.filter(usrid = Users.objects.get(usrname = para_usrid)).values()
    for usrexp in usrexps:
        exp_object = Experiment.objects.get(expid = usrexp['expid_id'])
        experiments.append(exp_object.expid)
    return experiments

def get_data_by_exp(exp_object):
    datainfo=[]
    #get all the part_exp objects
    partexp_objects = ParticipantExperiment.objects.filter(expid = exp_object).values()
    for partexp_object in partexp_objects:
        data_objects = Data.objects.filter(exp_partid = partexp_object['exp_partid']).values()
        for data_object in data_objects:
            data_dicobject = {}
            #data_object = Data.objects.get(dataid = data_object_id)
            #TODO: more attributes could be returned, need to be implemented
            data_dicobject["dataid"] = data_object.id
            data_dicobject["datadescription"] = data_object.datadescription
            datainfo.append(data_dicobject)
    return datainfo

def serialise_object(obj):
    obj = obj.__dict__
    if "_state" in obj:
        del obj["_state"]
    return obj