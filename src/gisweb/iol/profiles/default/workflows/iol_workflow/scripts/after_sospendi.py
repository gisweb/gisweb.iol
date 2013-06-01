## Script (Python) "after_sospendi"
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

#INVIO MAIL SOSPENSIONE
doc.sendThisMail('sospendi')
