from django.conf import settings
import os

def dirsCheck(path):
    if not (os.path.exists(path) and os.path.isdir(path)):
        os.makedirs(path)
#    if not (os.path.exists(settings.DATA_DIRS) and os.path.isdir(settings.DATA_DIRS)):
#        os.makedirs(settings.DATA_DIRS)
#    if not (os.path.exists(settings.DATA_REL_DIRS) and os.path.isdir(settings.DATA_REL_DIRS)):
#        os.makedirs(settings.DATA_REL_DIRS)
#    if not (os.path.exists(settings.OUT_DIRS) and os.path.isdir(settings.OUT_DIRS)):
#        os.makedirs(settings.OUT_DIRS)
#    if not (os.path.exists(settings.OUT_REL_DIRS) and os.path.isdir(settings.OUT_REL_DIRS)):
#        os.makedirs(settings.OUT_REL_DIRS)
