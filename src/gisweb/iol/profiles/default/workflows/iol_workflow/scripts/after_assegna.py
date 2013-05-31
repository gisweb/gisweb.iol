## Script (Python) "after_assegna"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object

# Aggiornamento dello stato su plominoDocument
doc.updateStatus()

# Invio della mail di avviso
doc.sendThisMail('assegna')
