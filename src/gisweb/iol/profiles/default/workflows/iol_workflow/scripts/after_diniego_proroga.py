## Script (Python) "after_diniego_proroga"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
#Aggiornamento dello stato su plominoDocument
doc = state_change.object
db = doc.getParentDatabase()

doc.updateStatus()

#INVIO MAIL DINIEGO PROROGA
#state_change.object.inviaMail(tipo='rigetto')
