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
state_change.object.updateStatus()

#INVIO MAIL DINIEGO PROROGA
#state_change.object.inviaMail(tipo='rigetto')
