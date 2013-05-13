## Script (Python) "after_preavviso_rigetto"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object

#Aggiornamento dello stato su plominoDocument
doc.updateStatus()
#INVIO MAIL PREAVVISO RIGETTO
doc.sendThisMail('preavviso_rigetto')
