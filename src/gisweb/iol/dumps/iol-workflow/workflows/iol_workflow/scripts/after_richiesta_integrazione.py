## Script (Python) "after_richiesta_integrazione"
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
