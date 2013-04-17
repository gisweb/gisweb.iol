## Script (Python) "statesInfo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO: usare doc.wf_statesInfo(args=['description'])
##
"""
per dettagli:
http://projects.gisweb.it/projects/gisweb-utils/repository/revisions/master/entry/src/gisweb/utils/workflow_utils.py#L69

questo file è ancora qui solo per ragioni di retro-compatibilità
se non è più usato meglio rimuoverlo!

"""

return context.wf_statesInfo(args=['description'])
