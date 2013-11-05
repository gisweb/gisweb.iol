## Script (Python) "after_inizializza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object 
db = doc.getParentDatabase()

# Aggiornamento dello stato su plominoDocument
doc.updateStatus()
