## Script (Python) "iol_onDeleteDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=kin_events=None, anchor=False
##title=
##
"""
Standardizzazione dele operazioni da svolgere alla cancellazione di una istanza
kin_events: 'child' o 'parent' (lancia gli script appropriati di gestione dell'uno a molti)
anchor: modalità per il redirect sulla pratica "genitore"
"""

if kin_events == 'child':
    context.ondelete_child(anchor=anchor)
elif kin_events == 'parent':
    context.ondelete_parent()
