"""
WSGI config for friendspeak project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
""
Original wsgi.py
""
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "friendspeak.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
""
START EDIT FROM https://wiki.gandi.net/en/simple/instance/python ***worked, now error (SECRET_KEY setting must not be empty)
""
WORKING WSGI FILE FROM GANDI
import sys
import os
import os.path
 
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'friendspeak')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'friendspeak.settings')
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
""
TESTING FROM KEDFILMS
"""
import os, sys

django_project = os.path.abspath(os.path.join(os.path.dirname(__file__), 'friendspeak'))
sys.path.append(django_project)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'friendspeak.settings')
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()