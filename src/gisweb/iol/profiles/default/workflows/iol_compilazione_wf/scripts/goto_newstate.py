## Script (Python) "goto_newstate"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from Products.CMFPlomino.PlominoUtils import StringToDate, json_loads
doc = state_change.object

if doc.getItem('iol_tipo_richiesta') not in ['fine_lavori','inizio_lavori','integrazione']:   

    frm = doc.wf_getInfoFor("wf_formname")
    app = doc.getItem("iol_tipo_app","default")
    doc.setItem("Form","frm_%s_%s" %(app,frm))
