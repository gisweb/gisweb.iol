## Script (Python) "iol_beforeCreateDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=child_events=False, msg='', redirect_to=''
##title=IOL beforCreateDocument event common actions
##

from gisweb.iol.scripts.frm_beforeCreateDocument import frm_beforeCreateDocument
frm_beforeCreateDocument(context, child_events, msg, redirect_to)
