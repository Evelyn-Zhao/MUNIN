from django.db import models
from django.contrib.postgres.fields import ArrayField
import datetime

# Create your models here.
class Users (models.Model):
    usrname = models.CharField(max_length=20, primary_key=True)
    usrfirstname = models.CharField(max_length=20)
    usrlastname = models.CharField(max_length=20)
    usrpwd = models.CharField(max_length=40)
    usremail = models.CharField(max_length=30, blank=True)
    usrauthority = models.IntegerField() 

#the id of ecperimenter will be used to find the location of data files
class Experiment (models.Model):
    expid = models.AutoField(primary_key=True) 
    expname = models.CharField(max_length=200)
    exptype = models.CharField(max_length=10)
    expstartd = models.DateField()
    expendd = models.DateField()
    expdescription = models.CharField(max_length=2000)
    #TODO: experimenter attri is removed as junction table is created
    experimenters = ArrayField(models.CharField(max_length=200))
    related_exps = ArrayField(models.IntegerField(), blank=True)
    generated_data = ArrayField(models.IntegerField(), blank=True)
    outcomes = ArrayField(models.IntegerField(), blank=True)
    #if deleted is true, the record will not show up 
    deleted = models.BooleanField(default=False)

class UserExperiment(models.Model):
    usr_expid = models.AutoField(primary_key=True) 
    expid = models.ForeignKey(Experiment, on_delete=models.CASCADE)
    usrid = models.ForeignKey(Users, on_delete=models.CASCADE)

#class ExpManager(models.Manager):
#    def get_exp_by_id(self, id):
#        return self.filter(expid = id)


class Outcome (models.Model):
    outid = models.AutoField(primary_key=True) 
    outtype = models.CharField(max_length=50)
    outdescription = models.CharField(max_length=400)
    expid = models.ForeignKey(Experiment, on_delete=models.CASCADE)
    related_out = ArrayField(models.IntegerField())

class Participant (models.Model):
    partid = models.AutoField(primary_key=True) 
    gender = models.CharField(max_length=12)
    age = models.IntegerField()
    occupation = models.CharField(max_length=30)

class ParticipantExperiment (models.Model):
    exp_partid = models.AutoField(primary_key=True) 
    expid = models.ForeignKey(Experiment, on_delete=models.CASCADE)
    partid = models.ForeignKey(Participant, on_delete=models.CASCADE)

class Equipment (models.Model):
    equipid = models.AutoField(primary_key=True) 
    equipname = models.CharField(max_length=200)

class UploadedData (models.Model):
    updataid = models.AutoField(primary_key=True)
    upload = models.FileField(upload_to = 'uploads/%Y/%m/%d/')

class Data (models.Model):
    dataid = models.AutoField(primary_key=True) 
    datatype = models.CharField(max_length=50)
    datadescription = models.CharField(max_length=400)
    #expid = models.ForeignKey(Experiment , on_delete=models.CASCADE)
    exp_partid = models.ForeignKey(ParticipantExperiment, on_delete=models.CASCADE)
    quipid = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    related_data = ArrayField(models.IntegerField())
    upload = models.FileField(upload_to = 'uploads/%Y/%m/%d/')
    #uploadRef = models.ForeignKey(UploadedData, on_delete=models.CASCADE)

