## Script (Python) "transitionList"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO: usare doc.wf_transitionsInfo(state_id=None, args=['description'])
##
"""
per dettagli:
http://projects.gisweb.it/projects/gisweb-utils/repository/revisions/master/entry/src/gisweb/utils/workflow_utils.py#L108

se questo file non è più usato meglio rimuoverlo!

"""

from Products.CMFCore.utils import getToolByName

wf = getToolByName(context, 'portal_workflow')
trList=[]
for tr in wf.getTransitionsFor(context):
    trList.append(dict(id=tr['id'],text=tr['description'] or '' ,label=tr['title_or_id']))
return trList
