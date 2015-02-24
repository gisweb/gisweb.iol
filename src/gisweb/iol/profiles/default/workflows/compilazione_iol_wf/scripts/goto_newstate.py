## Script (Python) "goto_newstate"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object
frm = doc.wf_getInfoFor("wf_formname")
app = doc.getItem("iol_tipo_app","default")
doc.setItem("Form","frm_%s_%s" %(app,frm))
